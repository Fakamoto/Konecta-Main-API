/* eslint-disable */
export const removeDuplicates = (array: any[]) : any[] => {
    return array.filter((element:any, index:number, self:any[]) => index === self.indexOf(element));
};
