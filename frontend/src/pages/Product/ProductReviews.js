import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createproductReview } from "../../actions/productActions";
import { Link, useNavigate } from "react-router-dom";
import Rating from "../../components/Rating";
import {
  Image,
  Button,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  Input,
  Heading,
  Box,
  Text,
  Flex,
  Avatar,
  Collapse,
  useDisclosure,
  Grid,
  GridItem,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const ProductReviews = ({ product, isPurchased }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewImage, setReviewImage] = useState(null);
  const [sortOption, setSortOption] = useState("recent"); // Default sort by recent
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const { error: errorProductReview } = productReviewCreate;

  // Calculate average rating
  const approvedReviews = product.reviews?.filter((r) => r.approved) || [];
  const averageRating =
    approvedReviews.length > 0
      ? (
          approvedReviews.reduce((sum, review) => sum + review.rating, 0) /
          approvedReviews.length
        ).toFixed(1)
      : 0;

  // Sort reviews based on selected option
  const sortedReviews = [...approvedReviews].sort((a, b) => {
    switch (sortOption) {
      case "highest":
        return b.rating - a.rating; // Highest rating first
      case "lowest":
        return a.rating - b.rating; // Lowest rating first
      case "recent":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt); // Most recent first
    }
  });

  // Show only first 4 reviews
  const visibleReviews = sortedReviews.slice(0, 4);
  const hasMoreReviews = approvedReviews.length > 4;

  const submitHandler = () => {
    dispatch(
      createproductReview(
        product._id,
        {
          rating,
          comment,
        },
        reviewImage
      )
    );
    setRating(0);
    setComment("");
    setReviewImage(null);
    onToggle();
  };

  const handleViewAllReviews = () => {
    navigate(`/products/${product._id}/reviews`);
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} boxShadow="sm" bg="white">
      {/* Reviews Header with Sort Dropdown */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h2" size="md" fontWeight="semibold">
          Customer Reviews
        </Heading>
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
      </Flex>
      {/* Rating Breakdown */}
      {approvedReviews.length > 0 && (
        <Box mb={6}>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = approvedReviews.filter(
              (r) => r.rating === star
            ).length;
            const percentage = (count / approvedReviews.length) * 100;
            return (
              <Flex key={star} align="center" mb={2}>
                <Flex align="center" w="30px" justify="space-between" mr={2}>
                  <Text fontSize="sm">{star}</Text>
                  <Text fontSize="sm">★</Text>
                </Flex>
                <Box flex="1" mx={2} bg="gray.100" h="8px" borderRadius="full">
                  <Box
                    bg="orange.400"
                    h="100%"
                    borderRadius="full"
                    width={`${percentage}%`}
                  />
                </Box>
                <Text fontSize="sm" color="gray.600" w="40px" textAlign="right">
                  {count}
                </Text>
              </Flex>
            );
          })}
        </Box>
      )}

      {/* Rate Product Button */}
      {isPurchased && (
        <Button
          colorScheme="blue"
          variant="outline"
          size="sm"
          onClick={onToggle}
          mb={6}
          width="full"
        >
          Write a Review
        </Button>
      )}
      {/* Sort Dropdown */}
      {approvedReviews.length > 0 && (
        <Flex justify="flex-end" mb={4}>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              variant="outline"
              size="sm"
            >
              Sort by:{" "}
              {sortOption === "highest"
                ? "Highest Rating"
                : sortOption === "lowest"
                ? "Lowest Rating"
                : "Most Recent"}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setSortOption("recent")}>
                Most Recent
              </MenuItem>
              <MenuItem onClick={() => setSortOption("highest")}>
                Highest Rating
              </MenuItem>
              <MenuItem onClick={() => setSortOption("lowest")}>
                Lowest Rating
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      )}
      {/* Review Form - Collapsible */}
      <Collapse in={isOpen} animateOpacity>
        <Box
          p={4}
          borderWidth="1px"
          borderRadius="md"
          borderColor="gray.200"
          mb={6}
          bg="gray.50"
        >
          <Heading as="h3" size="sm" mb={4}>
            How would you rate this product?
          </Heading>
          {errorProductReview && (
            <Text color="red.500" mb={4} fontSize="sm">
              {errorProductReview}
            </Text>
          )}
          {userInfo ? (
            <FormControl>
              <Select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                mb={4}
                bg="white"
              >
                <option value="0">Select Rating</option>
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </Select>

              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share details of your experience with this product..."
                mb={4}
                rows={4}
                bg="white"
              />

              <FormLabel fontSize="sm">Add Photo (Optional)</FormLabel>
              <Input
                type="file"
                onChange={(e) => setReviewImage(e.target.files[0])}
                accept="image/*"
                mb={4}
                p={1}
                fontSize="sm"
              />

              <Flex justify="flex-end">
                <Button variant="ghost" onClick={onToggle} mr={3} size="sm">
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={submitHandler}
                  disabled={!rating || !comment}
                  size="sm"
                >
                  Submit Review
                </Button>
              </Flex>
            </FormControl>
          ) : (
            <Text fontSize="sm">
              Please{" "}
              <Link to="/login" style={{ color: "#0066c0" }}>
                sign in
              </Link>{" "}
              to write a review.
            </Text>
          )}
        </Box>
      </Collapse>

      {/* Approved Reviews (only showing first 4) */}
      {visibleReviews.length > 0 ? (
        <Box>
          {visibleReviews.map((review) => (
            <Box
              key={review._id}
              mb={6}
              pb={4}
              borderBottom="1px"
              borderColor="gray.200"
            >
              <Flex align="center" mb={2}>
                <Avatar name={review.name} size="sm" mr={3} bg="blue.500" />
                <Box>
                  <Text fontWeight="medium">{review.name}</Text>
                  <Flex align="center">
                    <Rating value={review.rating} size="14px" />
                    <Text ml={2} fontSize="xs" color="gray.500">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </Text>
                  </Flex>
                </Box>
              </Flex>
              <Text mb={3} fontSize="sm">
                {review.comment}
              </Text>
              {review.image && (
                <Image
                  src={review.image}
                  alt="Review"
                  width="100px"
                  height="100px"
                  objectFit="cover"
                  borderRadius="md"
                  borderWidth="1px"
                  mb={3}
                />
              )}
              {/* <Text fontSize="xs" color="gray.500">
                Was this review helpful?
                <Button variant="link" color="blue.500" size="xs" ml={2}>
                  Yes
                </Button>
                <Button variant="link" color="blue.500" size="xs" ml={2}>
                  No
                </Button>
              </Text> */}
            </Box>
          ))}

          {/* View More Button */}
          {hasMoreReviews && (
            <Flex justify="center" mt={6}>
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={handleViewAllReviews}
              >
                View All Reviews ({approvedReviews.length})
              </Button>
            </Flex>
          )}
        </Box>
      ) : (
        <Box textAlign="center" py={6}>
          <Text color="gray.600" mb={4}>
            No reviews yet
          </Text>
          {isPurchased && (
            <Button
              colorScheme="blue"
              variant="outline"
              size="sm"
              onClick={onToggle}
            >
              Be the first to review
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProductReviews;
