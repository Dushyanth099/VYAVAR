import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  customizeProduct,
  saveCustomization,
} from "../../actions/productActions";
import { Canvas, Image } from "fabric";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  useToast,
} from "@chakra-ui/react";

const ProductCustomizer = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const toast = useToast();
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [text, setText] = useState("");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState("#000000");
  const [position, setPosition] = useState("center");

  const productCustomization = useSelector(
    (state) => state.productCustomization
  );
  const { loading, customizationOptions } = productCustomization;

  const productSaveCustomization = useSelector(
    (state) => state.productSaveCustomization
  );
  const {
    loading: saving,
    success: saveSuccess,
    design,
  } = productSaveCustomization;

  useEffect(() => {
    dispatch(customizeProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (saveSuccess) {
      toast({
        title: "Design Saved",
        description: "Your custom design has been saved for approval",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [saveSuccess, toast]);

  useEffect(() => {
    if (
      !customizationOptions ||
      !customizationOptions.baseImages ||
      !canvasRef.current
    )
      return;

    const initCanvas = () => {
      const fabricCanvas = new Canvas(canvasRef.current, {
        width: 500,
        height: 500,
        backgroundColor: "#f5f5f5",
      });

      fabric.Image.fromURL(customizationOptions.baseImages[0], (img) => {
        img.scaleToWidth(500);
        fabricCanvas.add(img);
        fabricCanvas.renderAll();
      });

      setCanvas(fabricCanvas);
    };

    initCanvas();

    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [customizationOptions, canvas]);

  const addTextToCanvas = () => {
    if (!canvas || !text) return;

    // Remove existing text objects
    canvas.getObjects().forEach((obj) => {
      if (obj.type === "text") {
        canvas.remove(obj);
      }
    });

    const fabricText = new fabric.Text(text, {
      fontFamily,
      fontSize,
      fill: color,
      left: 250,
      top: position === "top" ? 50 : position === "center" ? 250 : 450,
      originX: "center",
      originY: "center",
    });

    canvas.add(fabricText);
    canvas.renderAll();
  };

  const handleSaveDesign = () => {
    if (!canvas) return;

    const designData = canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    const designConfig = {
      designData,
      textConfig: {
        content: text,
        fontFamily,
        fontSize,
        color,
        position,
      },
    };

    dispatch(saveCustomization(id, designConfig));
  };

  return (
    <Box p={4} m={100} borderWidth={1} borderRadius="md">
      <Flex direction={{ base: "column", md: "row" }} gap={8}>
        <Box flex={1}>
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            style={{ border: "1px solid #ddd", maxWidth: "100%" }}
          />
        </Box>

        <Box flex={1}>
          <FormControl mb={4}>
            <FormLabel>Custom Text</FormLabel>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your custom text"
              maxLength={customizationOptions?.maxTextLength || 50}
            />
            <Text fontSize="sm" color="gray.500">
              {text.length}/{customizationOptions?.maxTextLength || 50}{" "}
              characters
            </Text>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Font Family</FormLabel>
            <Select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
            >
              {customizationOptions?.allowedFonts?.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Font Size: {fontSize}px</FormLabel>
            <Slider
              min={12}
              max={72}
              step={2}
              value={fontSize}
              onChange={(value) => setFontSize(value)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Text Color</FormLabel>
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              width="100px"
              height="50px"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Text Position</FormLabel>
            <Select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            >
              {customizationOptions?.textPositionOptions?.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </Select>
          </FormControl>

          <Button
            colorScheme="blue"
            onClick={addTextToCanvas}
            mb={4}
            isFullWidth
          >
            Preview Text
          </Button>

          <Button
            colorScheme="green"
            onClick={handleSaveDesign}
            isLoading={saving}
            isFullWidth
          >
            Save Custom Design
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default ProductCustomizer;
