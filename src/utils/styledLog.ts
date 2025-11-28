// src/utils/styledLog.ts
export function styledLog(
  data: object | string | number | boolean | undefined | null | Array<object>,
  title = "Log",
  type: "success" | "danger" | "info" | "alert" = "info",
) {
  const typeColors: Record<string, string> = {
    success: "green",
    danger: "red",
    info: "blue",
    alert: "orange",
  };

  const color = typeColors[type] || "black";

  const style = `
    color: ${color};
    font-weight: bold;
    background-color: lightgray;
    padding: 5px;
    border-radius: 3px;
  `;

  console.log(`%c${title}`, style);
  console.log(JSON.stringify(data));
}
