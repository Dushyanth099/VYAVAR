import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getCustomizations,
  approveCustomization,
} from "../actions/productActions";
import {
  Box,
  Button,
  Flex,
  Grid,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";

const AdminCustomizationApproval = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const toast = useToast();

  const customizationsList = useSelector(
    (state) => state.productCustomizationsList
  );
  const { loading, designs } = customizationsList;

  const customizationApprove = useSelector(
    (state) => state.productApproveCustomization
  );
  const { loading: approving, success: approveSuccess } = customizationApprove;

  useEffect(() => {
    dispatch(getCustomizations(id));
  }, [dispatch, id, approveSuccess]);

  const handleApprove = (designId) => {
    dispatch(approveCustomization(id, designId));
  };

  useEffect(() => {
    if (approveSuccess) {
      toast({
        title: "Design Approved",
        description: "The custom design has been approved",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [approveSuccess, toast]);

  return (
    <Box p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Custom Designs for Approval
      </Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : designs && designs.length > 0 ? (
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          {designs.map((design) => (
            <Box key={design._id} borderWidth="1px" borderRadius="lg" p={4}>
              <Image
                src={design.designData}
                alt="Custom design"
                mb={4}
                maxH="300px"
                objectFit="contain"
              />

              <Text mb={2}>
                <strong>User:</strong> {design.user?.name || "Unknown"}
              </Text>

              <Text mb={2}>
                <strong>Text:</strong> {design.textConfig.content}
              </Text>

              <Text mb={2}>
                <strong>Font:</strong> {design.textConfig.fontFamily},{" "}
                {design.textConfig.fontSize}px
              </Text>

              <Text mb={4}>
                <strong>Color:</strong> {design.textConfig.color}
              </Text>

              {!design.approved && (
                <Button
                  colorScheme="green"
                  onClick={() => handleApprove(design._id)}
                  isLoading={approving}
                >
                  Approve Design
                </Button>
              )}

              {design.approved && (
            <Text color="green.500" fontWeight="bold">
                  Approved
                </Text>
              )}
            </Box>
          ))}
        </Grid>
      ) : (
        <Text>No custom designs awaiting approval</Text>
      )}
    </Box>
  );
};

export default AdminCustomizationApproval;
