export const fetcher = async (...args) => await fetch(...args).then((res) => res.json());

export const favoritesUrl = `/api/design?sortField=likes&sortQ=-1&limit=8`;