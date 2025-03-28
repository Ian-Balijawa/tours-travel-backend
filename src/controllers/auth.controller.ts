import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { loginSchema, signupSchema } from '../validators/auth.validator';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async login( req: Request, res: Response ): Promise<void> {
        const { email, password } = await loginSchema.parseAsync( req.body );
        const { token, user } = await this.authService.login( email, password );
        console.log(token, user)
        res.json( { success: true, data: { token, user } } );
    }

    async logout( req: Request, res: Response ): Promise<void> {
        await this.authService.logout( req.user!.userId );
        res.status( 204 ).send();
    }

    async getCurrentUser( req: Request, res: Response ): Promise<void> {
        const user = await this.authService.findById( req.user!.userId );
        res.json( { success: true, data: user } );
    }

    async signup( req: Request, res: Response ): Promise<void> {
        try {
            console.log('Signup Request Body:', req.body);

            const data = await signupSchema.parseAsync( req.body );
            console.log('Validated Data:', data);

            const user = await this.authService.createAdmin( data );
            console.log('Created User:', user);

            res.status( 201 ).json( {
                success: true,
                data: user
            } );
        } catch ( error ) {
            console.error('Signup Error:', error);

            // Add more detailed error response
            res.status( 400 ).json( {
                success: false,
                message: error instanceof Error ? error.message : 'Signup failed'
            } );
        }
    }

    async update( req: Request, res: Response ): Promise<void> {
        const user = await this.authService.update( +req.params.id, req.body );
        res.json( {
            success: true,
            data: user
        } );
    }

    async delete( req: Request, res: Response ): Promise<void> {
        await this.authService.delete( +req.params.id );
        res.status( 204 ).send();
    }
}
