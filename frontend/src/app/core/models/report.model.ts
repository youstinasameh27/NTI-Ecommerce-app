export interface Report {
     totalOrders: number; 
     totalRevenue: number; 
     topProducts: 
     { 
        title: string; 
        sold: number;
     }[]; 
    }
