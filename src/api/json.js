/*
{
  "openapi": "3.0.1",
  "info": {
    "title": "TailorAPI",
    "version": "v1"
  },
  "paths": {
    "/api/Admin/summary": {
      "get": {
        "tags": [
          "Admin"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/GetAllCustomers": {
      "get": {
        "tags": [
          "Admin"
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/CustomerDTO"
                  }
                }
              },
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/CustomerDTO"
                  }
                }
              },
              "text/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/CustomerDTO"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/Admin/GetCustomer": {
      "get": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "customerId",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/CustomerDTO"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CustomerDTO"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/CustomerDTO"
                }
              }
            }
          }
        }
      }
    },
    "/api/Admin/AddCustomer": {
      "post": {
        "tags": [
          "Admin"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CustomerRequestDTO"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CustomerRequestDTO"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CustomerRequestDTO"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/CustomerDTO"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CustomerDTO"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/CustomerDTO"
                }
              }
            }
          }
        }
      }
    },
    "/api/Admin/EditCustomer": {
      "put": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "customerId",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CustomerRequestDTO"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CustomerRequestDTO"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CustomerRequestDTO"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/DeleteCustomer": {
      "delete": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "customerId",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/AddMeasurement": {
      "post": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "customerId",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/MeasurementRequestDTO"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/MeasurementRequestDTO"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/MeasurementRequestDTO"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/GetMeasurement": {
      "get": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "customerId",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/DeleteMeasurement": {
      "delete": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "measurementId",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/GetAllMeasurements": {
      "get": {
        "tags": [
          "Admin"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/AddProduct": {
      "post": {
        "tags": [
          "Admin"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ProductRequestDTO"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/ProductRequestDTO"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/ProductRequestDTO"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/UpdateProduct/{id}": {
      "put": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ProductRequestDTO"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/ProductRequestDTO"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/ProductRequestDTO"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/DeleteProduct/{id}": {
      "delete": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/GetProduct/{id}": {
      "get": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/GetAllProducts": {
      "get": {
        "tags": [
          "Admin"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/AddFabricType": {
      "post": {
        "tags": [
          "Admin"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/FabricTypeRequestDTO"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/FabricTypeRequestDTO"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/FabricTypeRequestDTO"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/UpdateFabricPrice": {
      "put": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "newPrice",
            "in": "query",
            "schema": {
              "type": "number",
              "format": "double"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/GetAllFabricTypes": {
      "get": {
        "tags": [
          "Admin"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/GetFabricTypeById": {
      "get": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/SoftDeleteFabricType": {
      "delete": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/AddFabricStock": {
      "post": {
        "tags": [
          "Admin"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/FabricStockRequestDTO"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/FabricStockRequestDTO"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/FabricStockRequestDTO"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/GetAllFabricStocks": {
      "get": {
        "tags": [
          "Admin"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/GetFabricStockById": {
      "get": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/Create-Order": {
      "post": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "customerId",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "productId",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "fabricTypeId",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "assignedTo",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/OrderRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/OrderRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/OrderRequestDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/Update-Order/{id}": {
      "put": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "productId",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "fabricTypeId",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "assignedTo",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/OrderRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/OrderRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/OrderRequestDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/UpdateOrderStatus/{orderId}": {
      "put": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "orderId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/OrderStatusUpdateDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/OrderStatusUpdateDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/OrderStatusUpdateDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/revenue": {
      "get": {
        "tags": [
          "Admin"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/Delete-Order/{id}": {
      "delete": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/Get-Order/{id}": {
      "get": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/{orderId}/approval": {
      "put": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "orderId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/OrderApprovalUpdateDTO"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/OrderApprovalUpdateDTO"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/OrderApprovalUpdateDTO"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/GetAll-Order": {
      "get": {
        "tags": [
          "Admin"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/rejected": {
      "get": {
        "tags": [
          "Admin"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/orders/{orderId}/reassign": {
      "post": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "orderId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ReassignOrderDTO"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/ReassignOrderDTO"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/ReassignOrderDTO"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/GetAll-Role": {
      "get": {
        "tags": [
          "Admin"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/GetById-Role/{id}": {
      "get": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/Update-Role{id}": {
      "put": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "string"
              }
            },
            "text/json": {
              "schema": {
                "type": "string"
              }
            },
            "application/*+json": {
              "schema": {
                "type": "string"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/Delete-Role{id}": {
      "delete": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/add-branch": {
      "post": {
        "tags": [
          "Admin"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/BranchRequestDTO"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/BranchRequestDTO"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/BranchRequestDTO"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/GetAll-User": {
      "get": {
        "tags": [
          "Admin"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/GetAllTailor-User": {
      "get": {
        "tags": [
          "Admin"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/GetUserById/{id}": {
      "get": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/Delete-User/{id}": {
      "delete": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Admin/Update-User/{id}": {
      "put": {
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UserRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/UserRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/UserRequestDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Auth/login": {
      "post": {
        "tags": [
          "Auth"
        ],
        "parameters": [
          {
            "name": "email",
            "in": "query",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "password",
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Auth/register": {
      "post": {
        "tags": [
          "Auth"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UserRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/UserRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/UserRequestDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Auth/verify-otp": {
      "post": {
        "tags": [
          "Auth"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/OtpVerificationsRequestDTO"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/OtpVerificationsRequestDTO"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/OtpVerificationsRequestDTO"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Payments/create-checkout-session": {
      "post": {
        "tags": [
          "Payments"
        ],
        "parameters": [
          {
            "name": "orderId",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Plan/buy": {
      "post": {
        "tags": [
          "Plan"
        ],
        "parameters": [
          {
            "name": "planId",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/webhook/stripe": {
      "post": {
        "tags": [
          "Webhook"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "BranchRequestDTO": {
        "type": "object",
        "properties": {
          "BranchName": {
            "type": "string",
            "nullable": true
          },
          "Location": {
            "type": "string",
            "nullable": true
          },
          "ShopId": {
            "type": "integer",
            "format": "int32"
          }
        },
        "additionalProperties": false
      },
      "CustomerDTO": {
        "type": "object",
        "properties": {
          "CustomerId": {
            "type": "integer",
            "format": "int32"
          },
          "BranchId": {
            "type": "integer",
            "format": "int32"
          },
          "BranchName": {
            "type": "string",
            "nullable": true
          },
          "ShopId": {
            "type": "integer",
            "format": "int32"
          },
          "ShopName": {
            "type": "string",
            "nullable": true
          },
          "FullName": {
            "type": "string",
            "nullable": true
          },
          "PhoneNumber": {
            "type": "string",
            "nullable": true
          },
          "Email": {
            "type": "string",
            "nullable": true
          },
          "Address": {
            "type": "string",
            "nullable": true
          },
          "Gender": {
            "enum": [
              "Male",
              "Female"
            ],
            "type": "string"
          }
        },
        "additionalProperties": false
      },
      "CustomerRequestDTO": {
        "type": "object",
        "properties": {
          "FullName": {
            "type": "string",
            "nullable": true
          },
          "BranchName": {
            "type": "string",
            "nullable": true
          },
          "ShopName": {
            "type": "string",
            "nullable": true
          },
          "PhoneNumber": {
            "type": "string",
            "nullable": true
          },
          "Email": {
            "type": "string",
            "nullable": true
          },
          "Address": {
            "type": "string",
            "nullable": true
          },
          "Gender": {
            "enum": [
              "Male",
              "Female"
            ],
            "type": "string"
          }
        },
        "additionalProperties": false
      },
      "FabricStockRequestDTO": {
        "type": "object",
        "properties": {
          "FabricTypeID": {
            "type": "integer",
            "format": "int32"
          },
          "BranchName": {
            "type": "string",
            "nullable": true
          },
          "ShopName": {
            "type": "string",
            "nullable": true
          },
          "StockIn": {
            "type": "number",
            "format": "double"
          },
          "StockAddDate": {
            "type": "string",
            "format": "date-time"
          }
        },
        "additionalProperties": false
      },
      "FabricTypeRequestDTO": {
        "type": "object",
        "properties": {
          "FabricName": {
            "type": "string",
            "nullable": true
          },
          "BranchName": {
            "type": "string",
            "nullable": true
          },
          "ShopName": {
            "type": "string",
            "nullable": true
          },
          "PricePerMeter": {
            "type": "number",
            "format": "double"
          },
          "AvailableStock": {
            "type": "number",
            "format": "double"
          }
        },
        "additionalProperties": false
      },
      "MeasurementRequestDTO": {
        "type": "object",
        "properties": {
          "BranchName": {
            "type": "string",
            "nullable": true
          },
          "ShopName": {
            "type": "string",
            "nullable": true
          },
          "Chest": {
            "type": "number",
            "format": "float"
          },
          "Waist": {
            "type": "number",
            "format": "float"
          },
          "Hip": {
            "type": "number",
            "format": "float"
          },
          "Shoulder": {
            "type": "number",
            "format": "float"
          },
          "SleeveLength": {
            "type": "number",
            "format": "float"
          },
          "TrouserLength": {
            "type": "number",
            "format": "float"
          },
          "Inseam": {
            "type": "number",
            "format": "float"
          },
          "Thigh": {
            "type": "number",
            "format": "float"
          },
          "Neck": {
            "type": "number",
            "format": "float"
          },
          "Sleeve": {
            "type": "number",
            "format": "float"
          },
          "Arms": {
            "type": "number",
            "format": "float"
          },
          "Bicep": {
            "type": "number",
            "format": "float"
          },
          "Forearm": {
            "type": "number",
            "format": "float"
          },
          "Wrist": {
            "type": "number",
            "format": "float"
          },
          "Ankle": {
            "type": "number",
            "format": "float"
          },
          "Calf": {
            "type": "number",
            "format": "float"
          }
        },
        "additionalProperties": false
      },
      "OrderApprovalUpdateDTO": {
        "required": [
          "ApprovalStatus"
        ],
        "type": "object",
        "properties": {
          "ApprovalStatus": {
            "enum": [
              "Pending",
              "Approved",
              "Rejected"
            ],
            "type": "string"
          },
          "BranchName": {
            "type": "string",
            "nullable": true
          },
          "ShopName": {
            "type": "string",
            "nullable": true
          },
          "RejectionReason": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "OrderRequestDto": {
        "type": "object",
        "properties": {
          "FabricLength": {
            "type": "number",
            "format": "double"
          },
          "Quantity": {
            "type": "integer",
            "format": "int32"
          },
          "CompletionDate": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "TotalPrice": {
            "type": "number",
            "format": "double"
          },
          "OrderStatus": {
            "enum": [
              "Pending",
              "Completed"
            ],
            "type": "string"
          },
          "paymentStatus": {
            "enum": [
              "Pending",
              "Completed"
            ],
            "type": "string"
          },
          "ApprovalStatus": {
            "enum": [
              "Pending",
              "Approved",
              "Rejected"
            ],
            "type": "string"
          }
        },
        "additionalProperties": false
      },
      "OrderStatusUpdateDto": {
        "type": "object",
        "properties": {
          "OrderStatus": {
            "enum": [
              "Pending",
              "Completed"
            ],
            "type": "string"
          },
          "BranchName": {
            "type": "string",
            "nullable": true
          },
          "ShopName": {
            "type": "string",
            "nullable": true
          },
          "PaymentStatus": {
            "enum": [
              "Pending",
              "Completed"
            ],
            "type": "string"
          },
          "CompletionDate": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "OtpVerificationsRequestDTO": {
        "type": "object",
        "properties": {
          "Email": {
            "type": "string",
            "nullable": true
          },
          "Otp": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "ProductRequestDTO": {
        "type": "object",
        "properties": {
          "ProductName": {
            "type": "string",
            "nullable": true
          },
          "MakingPrice": {
            "type": "number",
            "format": "double"
          },
          "BranchName": {
            "type": "string",
            "nullable": true
          },
          "ShopName": {
            "type": "string",
            "nullable": true
          },
          "ProductType": {
            "enum": [
              "Upper",
              "Lower"
            ],
            "type": "string"
          },
          "ImageUrl": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "ReassignOrderDTO": {
        "type": "object",
        "properties": {
          "UserID": {
            "type": "integer",
            "format": "int32"
          },
          "BranchName": {
            "type": "string",
            "nullable": true
          },
          "ShopName": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "UserRequestDto": {
        "type": "object",
        "properties": {
          "Name": {
            "type": "string",
            "nullable": true
          },
          "ShopId": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "BranchId": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "ShopName": {
            "type": "string",
            "nullable": true
          },
          "ShopLocation": {
            "type": "string",
            "nullable": true
          },
          "BranchName": {
            "type": "string",
            "nullable": true
          },
          "BranchLocation": {
            "type": "string",
            "nullable": true
          },
          "Email": {
            "type": "string",
            "nullable": true
          },
          "MobileNo": {
            "type": "string",
            "nullable": true
          },
          "Address": {
            "type": "string",
            "nullable": true
          },
          "Password": {
            "type": "string",
            "nullable": true
          },
          "RoleName": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      }
    },
    "securitySchemes": {
      "Bearer": {
        "type": "http",
        "description": "Enter 'Bearer' followed by your JWT token.",
        "scheme": "Bearer",
        "bearerFormat": "JWT"
      }
    }
  },
  "security": [
    {
      "Bearer": [ ]
    }
  ]
} 
  */