export function checkAdminCredentials(username: string, password: string) {
  return (
    Boolean(username) &&
    Boolean(password) &&
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  );
}

export function isAuthorized(request: Request) {
  const username = request.headers.get("x-admin-username") ?? "";
  const password = request.headers.get("x-admin-password") ?? "";
  return checkAdminCredentials(username, password);
}
