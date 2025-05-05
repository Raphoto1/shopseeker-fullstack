export const getInstagramPosts = async () => {
    const instaToken = process.env.INSTATOKEN;
    const instaPath = `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,media_type&access_token=${instaToken}`;
    const response = await fetch(instaPath);
    const data = await response.json();
    console.log(data);
    
    return data.data;
 };