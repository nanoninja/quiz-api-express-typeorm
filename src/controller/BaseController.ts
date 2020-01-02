import * as httpContext from 'express-http-context';
import { User } from '../entity/User';

export abstract class BaseController {

    /**
     * Get the context of the authenticated user for the incoming HTTP request.
     */
    getContextUser(): User {
        return httpContext.get('user');
    }

    /**
     * Check if the authenticated user has permissions to access the requested resource.
     */
    hasPrivilege(permission: string): boolean {
        return this.getContextUser().hasPrivilege(permission);
    }
}
