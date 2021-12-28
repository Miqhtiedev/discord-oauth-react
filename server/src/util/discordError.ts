export interface IDiscordError {
  code: number;
  error: string;
  message: string;
}

export default (err: any): IDiscordError => {
  if (err.response) {
    return { code: err.response.status, error: err.response.error ?? "Unknown error", message: err.response.error_description ?? "Discord API errors" };
  }
  return { code: 500, error: "Internal Server Error", message: "Interal server error" };
};
