declare namespace Express {
  interface Request {
    branchScope?: {
      pharmacyId: string;
      branchId?: string;
    };
    user?: {
      userId: string;
      username: string;
      role: string;
      roleId: string | null;
      roleName: string;
      name: string;
      branchId: string | null;
      branchName: string | null;
      jobRole: string;
      pharmacyId: string;
      pharmacyName: string;
      pharmacySlug: string;
      subscription: {
        status: string;
        plan: string;
        price: number;
        renewsAt: string;
      } | null;
      permissions: string[];
      mustChangePassword: boolean;
      isActive: boolean;
    };
  }
}