
export interface CodeVarificationResult {
  code: string;
  expires: Date;
}
const generateCodeVarification = (): CodeVarificationResult => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 minutes
  return {
    code,
    expires,
  };
};

export default generateCodeVarification;
