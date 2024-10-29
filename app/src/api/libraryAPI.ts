const BASE_URL = "https://gpzyo7nv2d.execute-api.ap-northeast-2.amazonaws.com";

export const fetchWords = async () => {
  try {
    const response = await fetch(`${BASE_URL}/ReadNow`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
