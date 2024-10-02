"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { FaCheck } from "react-icons/fa";

const OrdersPage = () => {
  const [orderLists, setOrderLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch data from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/order");
        if (!response.ok) {
          throw new Error("Failed to fetch order data");
        }

        const data = await response.json();
        const formattedData = data.map((order) => ({
          id: order.id, // Assuming each order has a unique 'id'
          name: order.name,
          toppings: order.toppings.join(", "),
          quantity: order.quantity,
          photo: order.photo,
          phoneNumber: order.phoneNumber,
          createdAt: new Date(order.createdAt).toLocaleString(),
          status: order.status,
        }));
        console.log("Formatted data:", formattedData);
        setOrderLists(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order data:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle opening the dialog with selected order details
  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (newStatus, orderId) => {
    try {
      const response = await fetch(`/api/order?id=${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update the orderLists state with the new status
      setOrderLists((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Define columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 200,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Avatar
              src={row.original.photo}
              alt={row.original.name}
              sx={{ width: 30, height: 30 }}
            />
            <span>{row.original.name}</span>
          </Box>
        ),
      },
      {
        accessorKey: "toppings",
        header: "Toppings",
        size: 150,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* <span>{row.original.toppings}</span> */}
            <IconButton
              onClick={() => handleOpenDialog(row.original)}
              aria-label="View Toppings"
              size="small"
            >
              {" "}
              <Visibility className="text-primary text-xl" />
              <p className="text-primary text-sm ml-1">Toppings</p>
            </IconButton>
          </Box>
        ),
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        size: 100,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        size: 150,
        Cell: ({ row }) => {
          const createdAt = new Date(row.original.createdAt);

          // Extracting time and date
          const time = createdAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }); // "HH:MM" format
          const date = createdAt.toLocaleDateString(); // "MM/DD/YYYY" or based on locale

          return (
            <div>
              <p className="font-medium text-black ">
                {time} <span className="font-normal text-gray-500">{date}</span>
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 150,
        Cell: ({ row }) => {
          const currentStatus = row.original.status;
          let bgColor;

          switch (currentStatus) {
            case "PREPARING":
              bgColor = "#ffa500"; // Gold
              break;
            case "READY":
              bgColor = "#008000"; // LightGreen
              break;
            // case "DELIVERED":
            //   bgColor = "#87CEFA"; // LightSkyBlue
            //   break;
            default:
              bgColor = "#ffa500"; // LightGray
          }

          if (currentStatus === "DELIVERED") {
            return (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <FaCheck sx={{ color: "#008000" }} color="#008000" size={22} />{" "}
                {/* Green checkmark */}
                <p className="text-base font-medium text-[#008000]">
                  Delivered
                </p>
              </Box>
            );
          }

          return (
            <FormControl
              className="flex  items-center justify-center "
              size="small"
            >
              <Select
                value={currentStatus}
                displayEmpty
                sx={{
                  backgroundColor: bgColor,
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent", // Remove the border when focused
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent", // Optional: Remove hover border if needed
                  },
                  svg: { color: "white" },
                }}
                className="rounded-lg"
                renderValue={() => (
                  <Typography
                    sx={{ textTransform: "capitalize", color: "white" }}
                    className="text-sm"
                  >
                    {currentStatus}
                  </Typography>
                )}
              >
                <MenuItem>
                  <RadioGroup
                    size="small"
                    aria-labelledby="order-status-radio-group"
                    value={currentStatus}
                    onChange={(e) =>
                      handleStatusChange(e.target.value, row.original.id)
                    }
                    // className="flex flex-col justify-start text-left"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "start",
                      alignItems: "start",
                    }}
                  >
                    <FormControlLabel
                      value="PREPARING"
                      control={<Radio />}
                      labelPlacement="start"
                      label="Preparing"
                    />
                    <FormControlLabel
                      value="READY"
                      control={<Radio />}
                      labelPlacement="start"
                      label="Ready"
                    />
                    <FormControlLabel
                      value="DELIVERED"
                      control={<Radio />}
                      label="Delivered"
                      labelPlacement="start"
                    />
                  </RadioGroup>
                </MenuItem>
              </Select>
            </FormControl>
          );
        },
      },
    ],
    [handleStatusChange]
  );

  // Custom Radio Button component inside MenuItem
  const getToppingColor = (topping) => {
    switch (topping.toLowerCase()) {
      case "tomato":
        return "#FF6347";
      case "Pepperoni":
        return "#FFA500";
      case "Mozzarella":
        return "#FFD700";

      default:
        return "#A9A9A9";
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: orderLists, // Use fetched data
    enableColumnActions: false,
    enableSorting: false,
    enablePagination: false,
    enableTableFooter: false,
    enableStickyFooter: false,
    enableBottomToolbar: false,
    enableColumnFilterModes: true,
    manualFiltering: true,
    muiTableContainerProps: { sx: { border: 1, borderColor: "#e0e0e0" } },
    muiTablePaperProps: { sx: { px: 5, pt: 2, pb: 10 } },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
        <h1 className="text-lg font-normal text-gray-500">Orders</h1>
      </Box>
    ),
    muiTableHeadCellProps: (table) => ({
      sx: {
        backgroundColor: "#f6f6f6",
      },
    }),
  });

  return (
    <div className="p-8">
      <MaterialReactTable table={table} />

      {/* Dialog for Toppings Details */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle
          className="relative items-center justify-center text-3xl font-semibold "
          sx={{ textAlign: "center", justifyContent: "center" }}
        >
          <span>Order Details</span>
          <DialogActions className="absolute right-2 top-2">
            <Button onClick={handleCloseDialog}>
              <HighlightOffIcon sx={{ color: "black" }} />
            </Button>
          </DialogActions>
        </DialogTitle>

        <DialogContent className="w-[500px]  py-20 pr-16">
          {selectedOrder && (
            <>
              <DialogContentText className="mb-3">
                <p className="text-gray-500 text-lg">
                  Name:
                  <span className="text-black ml-4">
                    {selectedOrder.name}{" "}
                  </span>{" "}
                </p>
              </DialogContentText>
              <DialogContentText className="flex gap-2 mb-3">
                <p className="text-gray-500 text-lg ">Toppings:</p>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {selectedOrder.toppings.split(",").map((topping, index) => (
                    <Box
                      key={index}
                      sx={{
                        backgroundColor: getToppingColor(topping.trim()),
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {topping.trim()}
                    </Box>
                  ))}
                </Box>
              </DialogContentText>
              <DialogContentText>
                <p className="text-gray-500 text-lg">
                  Quantity:
                  <span className="text-black ml-4">
                    {selectedOrder.quantity}{" "}
                  </span>{" "}
                </p>
              </DialogContentText>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;

// "use client";
// import { useEffect, useMemo, useState } from "react";
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
// } from "material-react-table";
// import { Box } from "@mui/material";

// //nested data is ok, see accessorKeys in ColumnDef below
// const data = [
//   {
//     photo:
//       "https://res.cloudinary.com/dqavpwzbn/image/upload/v1727733442/menu_photos/nmzhcdqougzhysxakput.png",
//     name: "Cornell1",
//     toppings: "Tomato",
//     phoneNumber: "1-234-567-8901",
//     quanitity: 1,
//     status: "PREPARING",
//     createdAt: "2024-10-01T10:15:20.492Z",
//   },
//   {
//     photo:
//       "https://res.cloudinary.com/dqavpwzbn/image/upload/v1727733442/menu_photos/nmzhcdqougzhysxakput.png",
//     name: "Cornell2",
//     toppings: "Tomato",
//     phoneNumber: "1-234-567-8901",
//     quanitity: 1,
//     status: "PREPARING",
//     createdAt: "2024-10-01T10:15:20.492Z",
//   },
//   {
//     photo:
//       "https://res.cloudinary.com/dqavpwzbn/image/upload/v1727733442/menu_photos/nmzhcdqougzhysxakput.png",
//     name: "Cornell3",
//     toppings: "Tomato, Onion",
//     phoneNumber: "1-234-567-8901",
//     quanitity: 1,
//     status: "PREPARING",
//     createdAt: "2024-10-01T10:15:20.492Z",
//   },
//   {
//     photo:
//       "https://res.cloudinary.com/dqavpwzbn/image/upload/v1727733442/menu_photos/nmzhcdqougzhysxakput.png",
//     name: "Cornell4",
//     toppings: "Tomato, Egg",
//     phoneNumber: "1-234-567-8901",
//     quanitity: 1,
//     status: "PREPARING",
//     createdAt: "2024-10-01T10:15:20.492Z",
//   },
// ];

// const OrdersPage = () => {
//   const [orderLists, setOrderLists] = useState([]);

//   // Fetch data from the backend
//   useEffect(() => {
//     const fetchMenus = async () => {
//       try {
//         const response = await fetch("/api/order");
//         if (!response.ok) {
//           throw new Error("Failed to fetch menu data");
//         }

//         const data = await response.json();
//         const formattedData = data.map((order) => ({
//           //  ...order,
//           name: order.name,
//           toppings: order.toppings.join(", "),
//           quanitity: order.quantity,
//           photo: order.photo,
//           createdAt: order.createdAt,
//           status: order.status,
//           createdAt: order.createdAt,
//         }));
//         console.log("formatted data in the order", formattedData);
//         // setOrderLists(formattedData);
//         // setLoading(false);
//       } catch (error) {
//         console.error("Error fetching pizza data:", error);
//         setLoading(false);
//       }
//     };

//     fetchMenus();
//   }, []);
//   //should be memoized or stable
//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "name", //access nested data with dot notation
//         header: "Name",
//         size: 150,
//       },
//       {
//         accessorKey: "toppings",
//         header: "Toppings",
//         size: 150,
//       },

//       {
//         accessorKey: "phoneNumber", //normal accessorKey
//         header: "Customer No",
//         size: 200,
//       },

//       {
//         accessorKey: "createdAt",
//         header: "Created At",
//         size: 150,
//       },
//       {
//         accessorKey: "status",
//         header: "Status",
//         size: 150,
//       },

//     ],
//     []
//   );

//   const table = useMaterialReactTable({
//     columns,
//     data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
//     enableColumnActions: false,
//     enableSorting: false,
//     enablePagination: false,
//     enableTableFooter: false,
//     enableStickyFooter: false,
//     enableBottomToolbar: false,
//     enableColumnFilterModes: true,
//     manualFiltering: true,
//     muiTableContainerProps: { sx: { border: 1, borderColor: "#e0e0e0" } },
//     muiTablePaperProps: { sx: { p: 2 } },
//     renderTopToolbarCustomActions: ({ table }) => (
//       <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
//         <h1 className="text-lg font-normal text-gray-500">Orders</h1>
//       </Box>
//     ),

//     muiTableHeadCellProps: (table) => ({
//       sx: {
//         backgroundColor: "#f6f6f6",
//       },
//     }),
//   });

//   return (
//     <div className="m-8">
//       <MaterialReactTable table={table} />
//     </div>
//   );
// };

// export default OrdersPage;
