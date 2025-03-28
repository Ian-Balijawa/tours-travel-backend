import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { RegistrationController } from '../controllers/registration.controller';

const router = Router();
const registrationController = new RegistrationController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Registration:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phone
 *         - dateOfBirth
 *         - programId
 *         - startDate
 *         - emergencyName
 *         - emergencyPhone
 *         - emergencyRelation
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated registration ID
 *         firstName:
 *           type: string
 *           description: Participant's first name
 *         lastName:
 *           type: string
 *           description: Participant's last name
 *         email:
 *           type: string
 *           format: email
 *           description: Contact email address
 *         phone:
 *           type: string
 *           description: Contact phone number
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Participant's date of birth
 *         programId:
 *           type: string
 *           format: uuid
 *           description: ID of the program being registered for
 *         startDate:
 *           type: string
 *           format: date
 *           description: Program start date
 *         emergencyName:
 *           type: string
 *           description: Emergency contact name
 *         emergencyPhone:
 *           type: string
 *           description: Emergency contact phone
 *         emergencyRelation:
 *           type: string
 *           description: Relationship to emergency contact
 *         medicalConditions:
 *           type: string
 *           description: Any medical conditions (optional)
 *         allergies:
 *           type: string
 *           description: Any allergies (optional)
 *         medications:
 *           type: string
 *           description: Current medications (optional)
 */

/**
 * @swagger
 * /api/v1/registrations:
 *   post:
 *     summary: Create a new program registration
 *     tags: [Registrations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Registration'
 *     responses:
 *       201:
 *         description: Registration created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Registration'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post( '/',
    registrationController.create.bind( registrationController )
);

/**
 * @swagger
 * /api/v1/registrations:
 *   get:
 *     summary: Get all registrations
 *     tags: [Registrations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of registrations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Registration'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires admin role
 */
router.get( '/',
    registrationController.findAll.bind( registrationController )
);

// Protected routes
router.use( authenticate );
router.use( authorize( 'admin' ) );

router.get( '/:id',
    registrationController.findById.bind( registrationController )
);

router.get( '/program/:programId',
    registrationController.findByProgram.bind( registrationController )
);

router.put( '/:id',
    registrationController.update.bind( registrationController )
);

router.delete( '/:id',
    registrationController.delete.bind( registrationController )
);

router.get( '/program/:programId/availability',
    registrationController.checkAvailability.bind( registrationController )
);

export { router as registrationRoutes };
