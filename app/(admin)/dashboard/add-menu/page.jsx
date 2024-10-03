"use client";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { LuUpload } from "react-icons/lu";
import { useSession } from "next-auth/react";
import { defineAbilitiesFor } from "@/lib/ability";
import { useRouter } from "next/navigation";

const schema = z.object({
  pizzaName: z.string().min(1, "Pizza name is required"),
  toppings: z.array(z.string()).min(1, "At least one topping must be selected"),
  price: z.string().min(1, "Price is required"),
});

const initialToppings = [
  "Tomato",
  "Mozzarella",
  "Basil",
  "Pepperoni",
  "Bell Pepper",
];

const Page = () => {
  const { data: session, status } = useSession();
  const restaurantId = session?.user.restaurantId;
  // console.log("Session inside add menu", restaurantId);
  const [availableToppings, setAvailableToppings] = useState(initialToppings);
  const [image, setImage] = useState();
  const ability = defineAbilitiesFor(session?.user);
  const router = useRouter();

  // Check for permissions on page load
  useEffect(() => {
    if (!ability.can("manage", "all") && !ability.can("create", "Menu")) {
      router.replace("/not-permitted");
    }
  }, [ability, router]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      pizzaName: "",
      toppings: [],
      price: "",
    },
  });

  // if (!ability.can("create", "Menu")) {
  //   return <div>You do not have permission to create menu</div>;
  // }

  // const convertFileToBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onloadend = () => {
  //       resolve(reader.result);
  //     };
  //     reader.onerror = reject;
  //   });
  // };

  // const onSubmit = async (data) => {
  //   // Handle form submission
  //   // console.log("Form Data:", data);

  //   try {
  //     const logoBase64 = await convertFileToBase64(image);

  //     const response = await fetch("/api/menu/new", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         name: data.pizzaName,
  //         toppings: data.toppings,
  //         price: data.price,
  //         restaurantId: restaurantId,
  //         photo: logoBase64,
  //       }),
  //     });

  //     if (response.ok) {
  //       console.log("Menu added successfully");
  //       // const { restaurantId } = await response.json();
  //       // setRestaurantId(restaurantId); // Save the restaurant ID for the next form
  //     } else {
  //       console.log("Restaurant registration failed");
  //     }
  //   } catch (error) {
  //     console.error("some wrong went");
  //   }
  //   // Reset form after submission
  //   reset();
  // };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
    });
  };

  const onSubmit = async (data) => {
    try {
      const logoBase64 = await convertFileToBase64(image);

      const response = await fetch("/api/menu/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.pizzaName,
          toppings: data.toppings,
          price: data.price,
          restaurantId: restaurantId,
          photo: logoBase64, // Send base64 string
        }),
      });

      if (response.ok) {
        console.log("Menu added successfully");
      } else {
        console.log("Restaurant registration failed");
      }
    } catch (error) {
      console.error("Something went wrong");
    }
    reset();
  };

  const addNewTopping = () => {
    setAvailableToppings([...availableToppings, ""]);
  };

  const handleToppingChange = (index, value) => {
    const updatedToppings = [...availableToppings];
    updatedToppings[index] = value;
    setAvailableToppings(updatedToppings);
  };

  const removeTopping = (index) => {
    const updatedToppings = [...availableToppings];
    updatedToppings.splice(index, 1);
    setAvailableToppings(updatedToppings);
  };

  return (
    <div className="flex flex-col items-center justify-start mx-4 my-6 h-screen bg-white">
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 flex flex-col items-center justify-center  w-full max-w-md"
      >
        <h4 className="mb-6 text-lg text-center text-gray-700">Add Menu</h4>

        {/* Pizza Name */}
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          className="mb-4"
          size="small"
          {...register("pizzaName")}
          error={!!errors.pizzaName}
          helperText={errors.pizzaName?.message}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "burlywood", // Default border color
              },
              "&:hover fieldset": {
                borderColor: "goldenrod", // Border color on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "gray", // Border color when focused
              },
              "& input": {
                color: "black", // Text color
              },
            },
            "& .MuiFormLabel-root": {
              color: "darkgray", // Label color
            },
            "& .MuiFormLabel-root.Mui-focused": {
              color: "black", // Label color when focused
            },
          }}
        />

        {/* Toppings */}
        <div>
          <h4 className="text-gray-500 text-lg  font-normal   mb-2">Topping</h4>
          <div className="mb-4 grid grid-cols-3 gap-4">
            {availableToppings.map((topping, index) => (
              <div key={index} className="flex items-center">
                <Controller
                  name="toppings"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={topping}
                          checked={field.value.includes(topping)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...field.value, topping]);
                            } else {
                              field.onChange(
                                field.value.filter((item) => item !== topping)
                              );
                            }
                          }}
                          sx={{
                            color: "#FFA500",
                            "&.Mui-checked": {
                              color: "#FFA500",
                            },
                          }}
                        />
                      }
                      label={
                        <input
                          type="text"
                          className="max-w-[80px]"
                          value={topping}
                          onChange={(e) =>
                            handleToppingChange(index, e.target.value)
                          }
                        />
                      }
                    />
                  )}
                />
                {index >= initialToppings.length && (
                  <IconButton
                    aria-label="remove topping"
                    onClick={() => removeTopping(index)}
                  >
                    <RemoveIcon />
                  </IconButton>
                )}
              </div>
            ))}{" "}
            <button
              onClick={addNewTopping}
              className="bg-primary w-[80px] rounded-sm text-white px-2 py-1 "
            >
              <AddIcon /> Add
            </button>
            {errors.toppings && (
              <Typography variant="body2" color="error" className="mt-1">
                {errors.toppings.message}
              </Typography>
            )}
          </div>
        </div>

        {/* Add Topping Button */}

        {/* Price */}
        <TextField
          label="Price"
          variant="outlined"
          fullWidth
          type="text"
          inputProps={{ step: "0.01" }}
          className="mb-6 mt-2"
          size="small"
          {...register("price")}
          error={!!errors.price}
          helperText={errors.price?.message}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "burlywood", // Default border color
              },
              "&:hover fieldset": {
                borderColor: "goldenrod", // Border color on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "gray", // Border color when focused
              },
              "& input": {
                color: "black", // Text color
              },
            },
            "& .MuiFormLabel-root": {
              color: "darkgray", // Label color
            },
            "& .MuiFormLabel-root.Mui-focused": {
              color: "black", // Label color when focused
            },
          }}
        />
        {/* Upload Pizza Pic */}

        <div className="mb-4">
          {/* Hidden file input */}
          <input
            id="pizza-photo-upload"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="hidden"
          />

          {/* Custom upload area */}
          <label
            htmlFor="pizza-photo-upload"
            className="flex gap-2 items-center justify-center  px-10 py-3 rounded-md border-2 border-dotted border-gray-600 cursor-pointer hover:border-orange-500 transition duration-200 ease-in-out"
          >
            <LuUpload className="flex text-lg text-primary mb-2" />
            <span className="text-primary">Upload Pizza Photo</span>
          </label>

          {/* Display selected image name (optional) */}
          {image && (
            <p className="mt-2 text-sm text-gray-500">
              Selected file: {image.name}
            </p>
          )}
        </div>
        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          className="bg-primary px-20 py-3"
        >
          Submit
        </Button>
      </Box>
    </div>
  );
};

export default Page;
