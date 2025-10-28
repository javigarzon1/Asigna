import { Lawyer, Typology } from "@/types/lawyer";
import { Query } from "@/types/query";

export function canLawyerHandleQuery(lawyer: Lawyer, query: Query): boolean {
  // Check if lawyer is available (workPercentage > 0)
  if (lawyer.workPercentage === 0) {
    return false;
  }

  // Check urgent queries
  if (query.isUrgent && !lawyer.canHandleUrgent) {
    return false;
  }

  // Check typologies
  if (lawyer.typologies.includes("Todo")) {
    return true;
  }

  return lawyer.typologies.some(typology => 
    query.typology.includes(typology) || typology.includes(query.typology)
  );
}

export function assignQueries(queries: Query[], lawyers: Lawyer[]): Query[] {
  const assignedQueries: Query[] = [];
  const lawyerAssignments = new Map<string, number>();

  // Initialize lawyer assignments
  lawyers.forEach(lawyer => {
    lawyerAssignments.set(lawyer.id, lawyer.currentAssignments || 0);
  });

  // Calculate max assignments per lawyer based on percentage
  const totalWorkCapacity = lawyers.reduce((sum, l) => sum + l.workPercentage, 0);
  const totalQueries = queries.length;

  queries.forEach(query => {
    // Check if query is already assigned to one of our lawyers
    if (query.assignedLawyer) {
      const existingLawyer = lawyers.find(l => 
        l.excelName === query.assignedLawyer || 
        l.name === query.assignedLawyer ||
        l.email === query.assignedLawyerEmail
      );
      
      if (existingLawyer && existingLawyer.workPercentage > 0) {
        // Check if it's a response or discrepancy (keep with same lawyer)
        if (query.lastAction?.toLowerCase().includes('respuesta') || 
            query.lastAction?.toLowerCase().includes('discrepancia')) {
          assignedQueries.push({
            ...query,
            assignedLawyer: existingLawyer.name,
            assignedLawyerEmail: existingLawyer.email
          });
          return;
        }
      }
    }

    // Find eligible lawyers
    const eligibleLawyers = lawyers.filter(lawyer => 
      canLawyerHandleQuery(lawyer, query)
    );

    if (eligibleLawyers.length === 0) {
      // No eligible lawyer found, keep unassigned
      assignedQueries.push(query);
      return;
    }

    // Sort by current assignments and work percentage
    eligibleLawyers.sort((a, b) => {
      const aAssignments = lawyerAssignments.get(a.id) || 0;
      const bAssignments = lawyerAssignments.get(b.id) || 0;
      
      const aRatio = aAssignments / a.workPercentage;
      const bRatio = bAssignments / b.workPercentage;
      
      return aRatio - bRatio;
    });

    // Assign to lawyer with lowest assignment ratio
    const selectedLawyer = eligibleLawyers[0];
    const currentCount = lawyerAssignments.get(selectedLawyer.id) || 0;
    lawyerAssignments.set(selectedLawyer.id, currentCount + 1);

    assignedQueries.push({
      ...query,
      assignedLawyer: selectedLawyer.name,
      assignedLawyerEmail: selectedLawyer.email,
      status: "pending"
    });
  });

  return assignedQueries;
}

export function parseExcelDate(excelDate: any): Date {
  if (excelDate instanceof Date && !isNaN(excelDate.getTime())) {
    return excelDate;
  }
  
  if (typeof excelDate === 'number') {
    // Excel dates are days since 1900-01-01
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  if (typeof excelDate === 'string') {
    const date = new Date(excelDate);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  // Return current date as fallback for invalid dates
  return new Date();
}
