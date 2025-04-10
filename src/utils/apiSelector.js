import { AdminApi } from '../api/AdminApi';
import { ManagerApi } from '../api/ManagerApi';
import { TailorApi } from '../api/TailorApi';

export const getApiForRole = (role) => {
  switch(role) {
    case 'Admin':
      return AdminApi;
    case 'Manager':
      return ManagerApi;
    case 'Tailor':
      return TailorApi;
    default:
      throw new Error(`Unsupported role: ${role}`);
  }
};
