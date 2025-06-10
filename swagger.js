const swaggerJsdoc = require('swagger-jsdoc');

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book API with Authentication',
      version: '1.0.0',
      description: 'A RESTful API for managing books and users with authentication',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      }
    ],
    components: {
      securitySchemes: {
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid',
          description: 'Session cookie for authentication'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Invalid input data'
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Something went wrong'
            }
          }
        },
        Book: {
          type: 'object',
          required: ['title', 'author', 'publishedYear', 'genre', 'isbn'],
          properties: {
            _id: {
              type: 'string',
              description: 'The book ID',
              example: '507f1f77bcf86cd799439011'
            },
            title: {
              type: 'string',
              description: 'The title of the book',
              example: 'The Great Gatsby'
            },
            author: {
              type: 'string',
              description: 'The author of the book',
              example: 'F. Scott Fitzgerald'
            },
            publishedYear: {
              type: 'number',
              description: 'The year the book was published',
              example: 1925
            },
            genre: {
              type: 'string',
              description: 'The genre of the book',
              example: 'Fiction'
            },
            isbn: {
              type: 'string',
              description: 'The ISBN of the book',
              example: '978-3-16-148410-0'
            },
            rating: {
              type: 'number',
              minimum: 0,
              maximum: 5,
              description: 'The rating of the book (0-5)',
              example: 4.5
            },
            summary: {
              type: 'string',
              description: 'A summary of the book',
              example: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The user ID',
              example: '507f1f77bcf86cd799439011'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'The user\'s email',
              example: 'user@example.com'
            },
            displayName: {
              type: 'string',
              description: 'The user\'s display name',
              example: 'John Doe'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'The user\'s role',
              example: 'user'
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              description: 'Last login timestamp',
              example: '2024-03-15T12:00:00Z'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the user account is active',
              example: true
            },
            profilePicture: {
              type: 'string',
              description: 'URL to user\'s profile picture',
              example: 'https://example.com/profile.jpg'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
              example: '2024-03-15T12:00:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
              example: '2024-03-15T12:00:00Z'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Operation successful'
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFoundError: {
          description: 'The specified resource was not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ValidationError: {
          description: 'Invalid input data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Books',
        description: 'Book management endpoints'
      },
      {
        name: 'Auth',
        description: 'Authentication endpoints'
      }
    ]
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpecs;
