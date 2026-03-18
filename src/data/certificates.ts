export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export const CERTIFICATES: Certificate[] = [
  {
    title:
      "BSc (Hons) Computer Systems Engineering — Second Class Honours (First Division)",
    issuer: "University of Sunderland",
    date: "Jun 2025",
  },
  {
    title: "Higher Diploma in Infocomm Technology — Distinction",
    issuer: "TMC Academy",
    date: "May 2024",
  },
  {
    title: "Higher National Diploma (HND) in Computing",
    issuer: "Scottish Qualification Authority · KMD Computer Centre",
    date: "Sep 2022",
  },
];
