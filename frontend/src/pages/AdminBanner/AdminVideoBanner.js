import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listVideoBanners,
  uploadVideoBanner,
  deleteVideoBanner,
} from "../../actions/bannerActions";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Spinner,
  Text,
  useToast,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";

const AdminVideoBanner = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  // Redux state for video banners
  const videoBannerList = useSelector((state) => state.getvideoBanners);
  const {
    loading,
    error,
    videos = [],
    productId: storedProductId,
  } = videoBannerList || {};

  const videoBannerUpload = useSelector((state) => state.addvideoBanners);
  const {
    loading: uploading,
    error: uploadError,
    success: uploadSuccess,
  } = videoBannerUpload;

  const videoBannerDelete = useSelector((state) => state.deletevideoBanners);
  const { success: deleteSuccess } = videoBannerDelete;

  // ✅ Product ID state
  const [productId, setProductId] = useState("");

  // ✅ Fetch videos on mount if `storedProductId` exists
  useEffect(() => {
    if (storedProductId) {
      setProductId(storedProductId);
      dispatch(listVideoBanners(storedProductId));
    }
  }, [dispatch, storedProductId]);

  // ✅ Fetch videos when `productId` is entered or updated
  useEffect(() => {
    if (productId) {
      dispatch(listVideoBanners(productId));
    }
  }, [dispatch, productId, uploadSuccess, deleteSuccess]);

  // Handle file selection
  const uploadHandler = (e) => {
    setVideo(e.target.files[0]);
  };

  // Handle video upload
  const [video, setVideo] = useState(null);
  const submitHandler = (e) => {
    e.preventDefault();
    if (!video || !productId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Product ID and select a video file.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    const formData = new FormData();
    formData.append("video", video);
    formData.append("productId", productId.trim());

    dispatch(uploadVideoBanner(formData));
    setVideo(null);
  };

  const deleteHandler = (videoId) => {
    console.log(
      `🗑️ Requesting delete for videoId: ${videoId}, productId: ${productId}`
    );

    if (window.confirm("Are you sure you want to delete this video?")) {
      dispatch(deleteVideoBanner(productId, videoId));
    }
  };

  return (
    <Box mt={10} p={6} maxW="800px" mx="auto">
      <h1 className="titlepanel">Video Banners</h1>

      {/* Product ID Input */}
      <FormControl mb={4}>
        <FormLabel>Enter Product ID</FormLabel>
        <Input
          type="text"
          placeholder="Enter Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value.trim())}
        />
        <Button
          mt={2}
          colorScheme="blue"
          onClick={() => dispatch(listVideoBanners(productId))}
        >
          Fetch Videos
        </Button>
      </FormControl>

      {/* Video Upload Form */}
      <Box bg="gray.100" p={4} borderRadius="md" mb={6}>
        <form onSubmit={submitHandler}>
          <FormControl>
            <FormLabel>Upload Video (MP4, AVI, MOV)</FormLabel>
            <Input
              type="file"
              accept="video/mp4,video/avi,video/mov"
              onChange={uploadHandler}
            />
          </FormControl>
          <Button
            mt={4}
            colorScheme="blue"
            type="submit"
            isLoading={uploading}
            loadingText="Uploading..."
          >
            Upload Video
          </Button>
        </form>
      </Box>

      {/* Error Messages */}
      {uploadError && (
        <Text color="red.500" mb={4}>
          {uploadError}
        </Text>
      )}
      {error && (
        <Text color="red.500" mt={4}>
          {error}
        </Text>
      )}

      {/* Display Existing Video Banners */}
      {loading ? (
        <Flex justify="center" mt={6}>
          <Spinner size="xl" />
        </Flex>
      ) : videos.length > 0 ? (
        <VStack spacing={6} align="stretch">
          {videos.map((video) => (
            <Box
              key={video._id}
              p={4}
              border="1px solid gray"
              borderRadius="md"
            >
              <video width="100%" controls>
                <source src={video.videoUrl} type="video/mp4" />
              </video>
              <Flex justify="space-between" mt={2}>
                <Text fontSize="sm" color="gray.600">
                  Uploaded on: {new Date(video.createdAt).toLocaleDateString()}
                </Text>
                <IconButton
                  aria-label="Delete Video"
                  icon={<MdDelete />}
                  colorScheme="red"
                  size="sm"
                  onClick={() => deleteHandler(video._id)}
                />
              </Flex>
            </Box>
          ))}
        </VStack>
      ) : (
        <Text color="gray.500" mt={4}>
          No videos found for this Product ID.
        </Text>
      )}
    </Box>
  );
};

export default AdminVideoBanner;
