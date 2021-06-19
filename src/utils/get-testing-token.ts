import axios from 'axios';

const getTestingToken = async (): Promise<string> => {
  const { data } = await axios.post(process.env.AUTH_URL as string, {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });
  return data.token;
};

export default getTestingToken;
