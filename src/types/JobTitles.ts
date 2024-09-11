export enum JobCategory {
    General = 'General',
    AccountExecutive = 'Account Executive',
    Accountant = 'Accountant',
    BusinessAnalyst = 'Business Analyst',
    CorporateFinance = 'Corporate Finance',
    CustomerSuccessManager = 'Customer Success Manager',
    InvestmentBanker = 'Investment Banker',
    MarketingManager = 'Marketing Manager',
    ProjectManager = 'Project Manager',
    RelationshipManager = 'Relationship Manager',
    SaleDevelopmentRepresentative = 'Sale Development Representative',
    SoftwareEngineer = 'Software Engineer',
    WealthManager = 'Wealth Manager',
    Other = 'Other'
}

export const JobTitles: Record<JobCategory, string[]> = {
    [JobCategory.General]: ['Operations Manager', 'Administrative Coordinator', 'Business Operations Analyst', 'Office Manager', 'Executive Assistant', 'Other'],
    [JobCategory.AccountExecutive]: ['Sales Executive', 'Account Manager', 'Client Services Executive', 'Business Development Manager', 'Key Account Manager', 'Other'],
    [JobCategory.Accountant]: ['Tax Accountant', 'Forensic Accountant', 'Cost Accountant', 'Auditor Accountant', 'Financial Accountant', 'Other'],
    [JobCategory.BusinessAnalyst]: ['Systems Analyst', 'Business Systems Analyst', 'Process Analyst', 'Data Analyst', 'Financial Analyst', 'Other'],
    [JobCategory.CorporateFinance]: ['Financial Analyst', 'Treasury Analyst', 'Corporate Development Manager', 'Financial Planner', 'Mergers & Acquisitions Analyst', 'Other'],
    [JobCategory.CustomerSuccessManager]: ['Customer Experience Manager', 'Client Success Specialist', 'Customer Support Manager', 'Account Success Manager', 'Customer Retention Specialist', 'Other'],
    [JobCategory.InvestmentBanker]: ['Mergers & Acquisitions Analyst', 'Equity Research Analyst', 'Capital Markets Associate', 'Investment Banking Associate', 'Structured Finance Analyst', 'Other'],
    [JobCategory.MarketingManager]: ['Digital Marketing Manager', 'Product Marketing Manager', 'Content Marketing Manager', 'Brand Manager', 'Market Research Manager', 'Other'],
    [JobCategory.ProjectManager]: ['Scrum Master', 'Project Coordinator', 'Program Manager', 'Agile Project Manager', 'Construction Project Manager', 'Other'],
    [JobCategory.RelationshipManager]: ['Client Relationship Executive', 'Business Development Manager', 'Customer Relationship Manager', 'Account Relationship Manager', 'Partnership Manager', 'Other'],
    [JobCategory.SaleDevelopmentRepresentative]: ['Business Development Representative', 'Inside Sales Representative', 'Lead Qualification Specialist', 'Sales Prospector', 'Outbound Sales Representative', 'Other'],
    [JobCategory.SoftwareEngineer]: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Mobile App Developer', 'Other'],
    [JobCategory.WealthManager]: ['Investment Advisor', 'Portfolio Manager', 'Financial Planner', 'Private Banker', 'Estate Manager', 'Other'],
    [JobCategory.Other]: ['Generalist', 'Project Coordinator', 'Administrative Assistant', 'Consultant Analyst', 'Research Associate', 'Other']
};

export type JobTitleString = typeof JobTitles[keyof typeof JobTitles][number];