const parseIsFavourite = (isFavour) => {
    const isString = typeof isFavour === 'string';
    if (!isString) return undefined;

    const validIsFavourite = ['true', 'false'];
    if (!validIsFavourite.includes(isFavour)) return undefined;

    return isFavour;
  };
  
  const parseContactType = (type) => {
    const isString = typeof type === 'string';
    if (!isString) return undefined;
  
    const validContactTypes = ['work', 'home', 'personal'];
    if (!validContactTypes.includes(type)) return undefined;

    return type;
  };
  
  export const parseFilterParams = (query) => {
    const { isFavourite, contactType } = query;
  
    const parsedIsFavourite = parseIsFavourite(isFavourite);
    const parsedContactType = parseContactType(contactType);
  
    return {
      isFavourite: parsedIsFavourite,
      contactType: parsedContactType,
    };
  };