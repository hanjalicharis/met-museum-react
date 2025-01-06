import axios from 'axios';

export const fetchDataFromAPI = async (query: string) => {
  try {
    const searchResponse = await axios.get(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}`
    );
    const objectIDs = searchResponse.data.objectIDs?.slice(0, 20) || [];
    const detailedData = await Promise.all(
      objectIDs.map(async (id: number) => {
        const details = await axios.get(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
        );
        return details.data;
      })
    );
    return detailedData;
  } catch (err) {
    throw new Error("Failed to fetch data");
  }
};
