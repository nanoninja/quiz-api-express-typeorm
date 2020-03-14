import * as httpContext from 'express-http-context';
import { User } from '../entity/User';

export abstract class BaseController {

    /**
     * Gets the context of the authenticated user for the incoming HTTP request.
     *
     * @return {User}
     */
    getContextUser(): User {
        return httpContext.get('user');
    }

    /**
     * Checks if the authenticated user has permissions to access the requested resource.
     *
     * @param {string} permission
     */
    hasPrivilege(permission: string): boolean {
        return this.getContextUser().hasPrivilege(permission);
    }

}
