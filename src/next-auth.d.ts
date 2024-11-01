import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      isDesigner: boolean;
      designerId?: string;
      image?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    isDesigner: boolean;
    designerId?: string;
    image?: string;
  }
}
