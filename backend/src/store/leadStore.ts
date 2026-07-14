import { CRMRecord } from '../types/crm';

export class LeadStore {
  private static globalMemoryLeads: CRMRecord[] = [];

  public static getAll(): CRMRecord[] {
    return this.globalMemoryLeads;
  }

  public static insertMany(records: CRMRecord[]): void {
    this.globalMemoryLeads.push(...records);
  }

  public static checkDuplicate(incomingLead: CRMRecord): boolean {
    if (this.globalMemoryLeads.length === 0) {
      return false;
    }

    return this.globalMemoryLeads.some((existingLead) => {
      // Safely handle nullable email fields
      const incomingEmail = incomingLead.email ? incomingLead.email.toString().trim().toLowerCase() : "";
      const existingEmail = existingLead.email ? existingLead.email.toString().trim().toLowerCase() : "";
      
      const emailMatch = incomingEmail !== "" && existingEmail !== "" && incomingEmail === existingEmail;
                       
      // Check phone numbers by extracting the last 10 digits
      let phoneMatch = false;
      const incomingPhone = incomingLead.mobile_without_country_code ? incomingLead.mobile_without_country_code.toString().trim() : "";
      const existingPhone = existingLead.mobile_without_country_code ? existingLead.mobile_without_country_code.toString().trim() : "";

      if (incomingPhone !== "" && existingPhone !== "") {
        const cleanIncoming = incomingPhone.replace(/\D/g, '');
        const cleanExisting = existingPhone.replace(/\D/g, '');
        
        if (cleanIncoming !== "" && cleanExisting !== "") {
          phoneMatch = 
            cleanIncoming === cleanExisting || 
            (cleanIncoming.length >= 10 && cleanExisting.length >= 10 && 
             cleanIncoming.slice(-10) === cleanExisting.slice(-10));
        }
      }

      return emailMatch || phoneMatch;
    });
  }

  public static clearStore(): void {
    this.globalMemoryLeads = [];
  }
}