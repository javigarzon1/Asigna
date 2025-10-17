export type Typology = 
  | "Productos de pasivo, recibos, cheques y pagarés"
  | "Productos de activo"
  | "Certificados no modelados"
  | "Avales nacionales"
  | "Todo";

export interface Lawyer {
  id: string;
  name: string;
  email: string;
  excelName: string;
  canHandleUrgent: boolean;
  typologies: Typology[];
  workPercentage: number;
  currentAssignments: number;
}

export const lawyers: Lawyer[] = [
  {
    id: "rgaitan",
    name: "Rocío Gaitan",
    email: "rgaitan@ramoncajal.com",
    excelName: "ROCIO GAITAN JURADO",
    canHandleUrgent: true,
    typologies: ["Todo"],
    workPercentage: 25,
    currentAssignments: 0
  },
  {
    id: "ffernandez",
    name: "Felicia Fernández",
    email: "ffernandez@ramoncajal.com",
    excelName: "FELICIA FERNANDEZ CUELLAR",
    canHandleUrgent: true,
    typologies: ["Avales nacionales"],
    workPercentage: 100,
    currentAssignments: 0
  },
  {
    id: "jipollicino",
    name: "Javier Pollicino",
    email: "jipollicino@ramoncajal.com",
    excelName: "JAVIER IGNACIO POLLICINO MARTINEZ",
    canHandleUrgent: true,
    typologies: ["Productos de activo", "Avales nacionales"],
    workPercentage: 100,
    currentAssignments: 0
  },
  {
    id: "jordonez",
    name: "Javier Ordóñez",
    email: "jordonez@ramoncajal.com",
    excelName: "JAVIER ORDOÑEZ GONZALEZ",
    canHandleUrgent: true,
    typologies: ["Productos de pasivo, recibos, cheques y pagarés", "Productos de activo", "Certificados no modelados"],
    workPercentage: 100,
    currentAssignments: 0
  },
  {
    id: "jpancorbo",
    name: "Jorge Pancorbo",
    email: "jpancorbo@ramoncajal.com",
    excelName: "JORGE PANCORBO MONTERO",
    canHandleUrgent: true,
    typologies: ["Productos de activo", "Avales nacionales"],
    workPercentage: 100,
    currentAssignments: 0
  },
  {
    id: "apino",
    name: "Alejandro Pino",
    email: "apino@ramoncajal.com",
    excelName: "ALEJANDRO PINO FRAGA",
    canHandleUrgent: true,
    typologies: ["Productos de pasivo, recibos, cheques y pagarés", "Productos de activo", "Certificados no modelados"],
    workPercentage: 100,
    currentAssignments: 0
  },
  {
    id: "jldelpino",
    name: "Jose Luis del Pino",
    email: "jldelpino@ramoncajal.com",
    excelName: "JOSE LUIS DEL PINO CABRERO",
    canHandleUrgent: true,
    typologies: ["Productos de pasivo, recibos, cheques y pagarés", "Productos de activo", "Certificados no modelados"],
    workPercentage: 100,
    currentAssignments: 0
  },
  {
    id: "amartin",
    name: "Agustín Martín",
    email: "amartin@ramoncajal.com",
    excelName: "AGUSTIN MARTIN NIETO",
    canHandleUrgent: false,
    typologies: ["Productos de pasivo, recibos, cheques y pagarés", "Productos de activo"],
    workPercentage: 70,
    currentAssignments: 0
  },
  {
    id: "moliver",
    name: "María Oliver",
    email: "moliver@ramoncajal.com",
    excelName: "MARIA OLIVER SANCHEZ",
    canHandleUrgent: true,
    typologies: ["Todo"],
    workPercentage: 100,
    currentAssignments: 0
  },
  {
    id: "rsocarras",
    name: "Rut Socarrás",
    email: "rsocarras@ramoncajal.com",
    excelName: "RUT SOCARRAS MANTILLA",
    canHandleUrgent: true,
    typologies: ["Todo"],
    workPercentage: 100,
    currentAssignments: 0
  },
  {
    id: "ezapata",
    name: "Elena Zapata",
    email: "ezapata@ramoncajal.com",
    excelName: "ELENA ZAPATA SERRANO",
    canHandleUrgent: true,
    typologies: ["Todo"],
    workPercentage: 100,
    currentAssignments: 0
  },
  {
    id: "abuendia",
    name: "Ángel Buendia",
    email: "abuendia@ramoncajal.com",
    excelName: "ANGEL BUENDIA ILERA",
    canHandleUrgent: true,
    typologies: ["Todo"],
    workPercentage: 100,
    currentAssignments: 0
  },
  {
    id: "cfernandez",
    name: "Carolina Fernández",
    email: "cfernandez@ramoncajal.com",
    excelName: "CAROLINA FERNANDEZ GARCIA",
    canHandleUrgent: true,
    typologies: ["Productos de activo", "Avales nacionales"],
    workPercentage: 80,
    currentAssignments: 0
  },
  {
    id: "adiaz",
    name: "Andrea Díaz",
    email: "adiaz@ramoncajal.com",
    excelName: "ANDREA DIAZ GRANADOS",
    canHandleUrgent: true,
    typologies: ["Todo"],
    workPercentage: 100,
    currentAssignments: 0
  }
];
