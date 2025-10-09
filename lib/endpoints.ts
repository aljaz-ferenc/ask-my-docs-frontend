const BASE_URL = process.env.BASE_URL;

if (!BASE_URL) throw new Error("Missing BASE_URL");

// biome-ignore lint/complexity/noStaticOnlyClass: !
export class Endpoints {
  public static query = `${BASE_URL}/query`;
  public static files = `${BASE_URL}/files`;
}
