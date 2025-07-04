import React, { useEffect, useState, useRef, Profiler } from "react";
import Rating from "../../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import {
  listProductDetails,
  createproductReview,
} from "../../actions/productActions";
import { IoLogoFacebook } from "react-icons/io";
import { AiFillTwitterCircle, AiFillInstagram } from "react-icons/ai";
import { addToCart } from "../../actions/cartActions";
import { AiFillShop } from "react-icons/ai";
import ShareButton from "./ShareButton";
import { MdDoNotDisturb } from "react-icons/md";
import ProductReviews from "./ProductReviews";
import {
  Image,
  Button,
  Badge,
  Flex,
  useToast,
  Heading,
  HStack,
  Text,
  Divider,
} from "@chakra-ui/react";
import HashLoader from "react-spinners/HashLoader";
import { useParams } from "react-router-dom";
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_CREATE_REVIEW_RESET,
} from "../../constants/productConstants";
import "./product.css";
import { Link } from "react-router-dom";
import { Listproductbyfiters } from "../../actions/productActions";
import CardProduct from "../../components/CardProduct";
import { useNavigate } from "react-router-dom";
import FeaturesSection from "../../components/Trustdetails/FeatureItem";
import Trust from "../../components/Trustdetails/Trust";
import { listMyOrders } from "../../actions/orderActions";
import ProductSpecification from "./ProductSpecification";
import FavoriteButton from "../../pages/Favourites/Favorites";
import viyavarbanner from "../../assets/viyavarbrandimage.png";

const Productpage = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(0);

  const relatedProductsList = useSelector((state) => state.productList);
  const { products: relatedProducts, loading: relatedLoading } =
    relatedProductsList;
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const orderListMy = useSelector((state) => state.orderMylist);
  const { orders } = orderListMy;
  const [qty, setQty] = useState(1);
  const [rating, setrating] = useState(0);
  const [comment, setcomment] = useState("");
  const toast = useToast();
  const imgs = document.querySelectorAll(".img-select a");
  const imgShowcase = useRef(null);
  const imgBtns = [...imgs];
  let imgId = 1;
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [isPurchased, setIsPurchased] = useState(false);
  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const { success: successProductReview, error: errorProductReview } =
    productReviewCreate;
  const availableSizes = product?.productdetails?.sizes || [];
  const [selectedSize, setSelectedSize] = useState("");
  const [showPDF, setShowPDF] = useState(false);
  const [reviewImage, setReviewImage] = useState(null);
  const rightColumnRef = useRef(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (rightColumnRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          rightColumnRef.current;
        const bottom = scrollHeight - scrollTop <= clientHeight + 10; // Adding small buffer
        setIsScrolledToBottom(bottom);
      }
    };

    const currentRef = rightColumnRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      // Initial check
      handleScroll();
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const togglePDF = () => setShowPDF((prev) => !prev);
  imgBtns.forEach((imgItem) => {
    imgItem.addEventListener("click", (event) => {
      event.preventDefault();
      imgId = imgItem.dataset.id;
      slideImage();
    });
  });

  function slideImage() {
    const displayWidth = document.querySelector(
      ".img-showcase img:first-child"
    ).clientWidth;
    imgShowcase.current.style.transform = `translateX(${
      -(imgId - 1) * displayWidth
    }px)`;
  }

  // Update the useEffect that checks for purchased products
  useEffect(() => {
    if (orders && orders.length > 0) {
      console.log("Full order items structure:", orders[0].orderItems);
      console.log("First order item product:", orders[0].orderItems[0].product);
      console.log("Type of product:", typeof orders[0].orderItems[0].product);

      const purchased = orders.some((order) => {
        return (
          order.isDelivered &&
          order.orderItems.some((item) => {
            const productId = item.product._id
              ? item.product._id.toString()
              : item.product.toString();
            console.log("Comparing:", productId, "with", id);
            return productId === id;
          })
        );
      });

      setIsPurchased(purchased);
    }
  }, [orders, id]);
  useEffect(() => {
    if (successProductReview) {
      alert("Review Submitted!");
      setrating(0);
      setcomment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(id));
    if (userInfo) {
      dispatch(listMyOrders());
    }
    if (product.category) {
      dispatch(Listproductbyfiters({ category: product.category }));
    }
  }, [dispatch, id, successProductReview, userInfo, product.category]);

  // product.reviews
  // const submithanlder = () => {
  //   dispatch(
  //     createproductReview(
  //       id,
  //       {
  //         rating,
  //         comment,
  //       },
  //       reviewImage
  //     )
  //   );
  // };
  // Calculate average rating
  const approvedReviews = product.reviews?.filter((r) => r.approved) || [];
  const averageRating =
    approvedReviews.length > 0
      ? (
          approvedReviews.reduce((sum, review) => sum + review.rating, 0) /
          approvedReviews.length
        ).toFixed(1)
      : 0;
  //Handler of button add to cart
  const addToCartHandler = () => {
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        status: "warning",
        duration: 4000,
        position: "top-right",
        isClosable: true,
      });
      navigate("/login");
      return;
    }
    // Check if size is required and not selected
    if (availableSizes.length > 0 && !selectedSize) {
      toast({
        title: "Select Size",
        position: "top-right",
        description: "Please select a size before adding to cart.",
        status: "warning",
        duration: 4000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }
    dispatch(addToCart(product._id, qty, selectedSize));
    navigate("/cart");
    toast({
      title: "Product added to cart",
      description: "View your product in the cart page.",
      status: "success",
      duration: 5000,
      position: "top-right",
      isClosable: true,
    });
  };
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = (index) => {
    setIsZoomVisible(true);
    setHoveredImageIndex(index);
  };
  const handleMouseLeave = () => setIsZoomVisible(false);
  return (
    <>
      <Helmet>
        <title>{product?.brandname || "Product"}</title>
      </Helmet>
      <div className="productpage">
        {loading ? (
          <div className="loading-product">
            <HashLoader color={"#1e1e2c"} loading={loading} size={50} />
          </div>
        ) : error ? (
          <h2>{error} </h2>
        ) : (
          <div className="card-wrapper">
            <div className="card">
              <div className="product-imgs">
                <div className="img-select">
                  {product.images.map((image, index) => (
                    <div className="img-item" key={index}>
                      <a href="#" data-id={index + 1}>
                        <Image
                          objectFit="cover"
                          width="100%"
                          height="100%"
                          src={image}
                          alt={`Thumbnail-${index}`}
                        />
                      </a>
                    </div>
                  ))}
                </div>
                <div
                  className="img-display"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => handleMouseEnter(hoveredImageIndex)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div ref={imgShowcase} className="img-showcase">
                    {product.images.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt={`Product-${index}`}
                        onMouseEnter={() => handleMouseEnter(index)}
                      />
                    ))}
                  </div>
                </div>

                {/* Zoomed Image View */}
                {isZoomVisible && (
                  <div
                    className="zoomed-image"
                    style={{
                      backgroundImage: `url(${product.images[hoveredImageIndex]})`,
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundSize: "200%",
                    }}
                  />
                )}
              </div>

              <div className="product-content">
                <Flex justifyContent="space-between" alignItems="center">
                  <h2 className="product-title">{product.brandname}</h2>
                  <Flex gap={1} mt="2">
                    <FavoriteButton productId={product._id} />
                    <ShareButton url={window.location.href} />
                  </Flex>
                </Flex>
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                  {product.description}
                </p>
                <Text fontSize="20px" fontWeight="bold" mb={1} mt={3}>
                  ₹{product.price}{" "}
                  <Text
                    as="span"
                    fontSize="20px"
                    fontWeight="normal"
                    color="black"
                    textDecoration="line-through"
                  >
                    MRP: ₹{product.oldPrice}
                  </Text>
                  <Text fontSize="13px" color="gray.500" mb={3}>
                    (Inclusive of all taxes)
                  </Text>
                  {approvedReviews.length > 0 && (
                    <Flex align="center">
                      <Badge
                        colorScheme="blue"
                        fontSize="md"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {averageRating} ★
                      </Badge>
                      <Text ml={2} fontSize="sm" color="gray.600">
                        ({approvedReviews.length}{" "}
                        {approvedReviews.length === 1 ? "review" : "reviews"})
                      </Text>
                    </Flex>
                  )}
                </Text>
                <Divider my={3} />
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    marginBottom: "5px",
                  }}
                >
                  Color: {product.productdetails?.color || "Not Available"}
                </p>
                <div className="product-detail">
                  <div>
                    <Text fontSize="lg" fontWeight="bold">
                      Size: {selectedSize}
                    </Text>
                    <HStack spacing={2} mt={2}>
                      {availableSizes.map((size) => (
                        <Button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          border="2px solid"
                          borderColor="#000346"
                          bg={selectedSize === size ? "#000346" : "white"}
                          color={selectedSize === size ? "white" : "#000346"}
                          _hover={{
                            bg: selectedSize === size ? "#000346" : "gray.100",
                          }}
                          px={6} // Increase padding for width
                          py={4} // Increase padding for height
                          minW="60px" // Ensures buttons are wider
                          minH="60px"
                          fontSize="lg"
                        >
                          {size}
                        </Button>
                      ))}
                    </HStack>
                    <Divider my={3} />
                    {product.sizeChart ? (
                      <>
                        <Button
                          background="#000346"
                          color={"white"}
                          size="sm"
                          onClick={togglePDF}
                          mb={2}
                          _hover={{
                            bg: "black",
                          }}
                        >
                          {showPDF ? "Close" : "Size Chart"}
                        </Button>

                        {showPDF && (
                          <iframe
                            src={`https://docs.google.com/gview?url=${encodeURIComponent(
                              product.sizeChart
                            )}&embedded=true`}
                            title="Size Chart PDF"
                            width="100%"
                            height="500px"
                            style={{
                              border: "1px solid #ccc",
                              borderRadius: "8px",
                              marginTop: "10px",
                            }}
                          />
                        )}
                      </>
                    ) : (
                      <p
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          marginBottom: "5px",
                        }}
                      >
                        Sizechart: Not Available    
                      </p>
                    )}

                    <HStack spacing={4} mt="5" mb="5">
                      <Button
                        onClick={addToCartHandler}
                        type="button"
                        disabled={product.countInStock === 0}
                        border="2px solid"
                        borderColor="#000346"
                        bg="white"
                        color="#000346"
                        fontWeight="bold"
                        px={8} // Increase padding for width
                        py={5} // Increase padding for height
                        minW="150px" // Ensures buttons are wider
                        minH="60px"
                        borderRadius="md"
                        _hover={{ bg: "gray.100" }}
                      >
                        Buy Now
                      </Button>

                      <Button
                        onClick={addToCartHandler}
                        type="button"
                        disabled={product.countInStock === 0}
                        bg="#000346"
                        color="white"
                        px={8} // Increase padding for width
                        py={5} // Increase padding for height
                        minW="150px" // Ensures buttons are wider
                        minH="60px"
                        borderRadius="md"
                        _hover={{ bg: "black", color: "white" }}
                      >
                        Add to Bag
                      </Button>
                    </HStack>

                    {product.countInStock === 0 && (
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color="red.500"
                        mt={3}
                        display="flex"
                        alignItems="center"
                      >
                        <MdDoNotDisturb
                          size="24"
                          style={{ marginRight: "5px" }}
                        />{" "}
                        OUT OF STOCK
                      </Text>
                    )}
                  </div>
                  <FeaturesSection />
                  <ProductSpecification product={product} />
                </div>{" "}
                {isPurchased && (
                  <ProductReviews product={product} isPurchased={isPurchased} />
                )}
              </div>
            </div>
          </div>
        )}
        <div className="productpagebanner">
          <img className="img-fluid" src={viyavarbanner} alt="banner" />
        </div>

        {/* Related Products Section */}
        <div
          className="related-products-section"
          px={{ base: 4, md: 12 }}
          my={8}
        >
          <Heading as="h3" size="sm" mb={4} ml={20}>
            RECOMMENDED
          </Heading>
          {relatedLoading ? (
            <HashLoader color={"#36D7B7"} />
          ) : (
            <div className="related-products-container">
              {relatedProducts
                .filter((p) => p._id !== product._id) // Exclude current product
                .slice(0, 6) // Show only 6 related products
                .map((relatedProduct) => (
                  <CardProduct
                    key={relatedProduct._id}
                    product={relatedProduct}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
      <Trust />
    </>
  );
};

export default Productpage;
