
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface GenericObject {
    [key: string]: string;
}


export function remove_array_object_duplicates(array_obj: GenericObject[], key: string = "value"): GenericObject[] {
    console.log('input key');
    console.log(key);
    
    if (!array_obj) {
        return [];
    }

    const empiric: string[] = [];
    const new_array_obj: GenericObject[] = array_obj.map((e) => {
        // eslint-disable-next-line no-prototype-builtins
        if (e.hasOwnProperty(key)) {
            if (!(empiric.includes(e[key]))) {
                empiric.push(e[key]); 
                return e;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }).filter((e1) => e1 !== null) as GenericObject[];

    return new_array_obj;
}


export function compare( a:GenericObject, b:GenericObject, key="label" ) {
        // eslint-disable-next-line no-prototype-builtins
        if(a.hasOwnProperty(key) && b.hasOwnProperty(key)){
            if ( a[key] < b[key]){
                return -1;
            }
            if ( a[key] > b[key] ){
                return 1;
            }
        }
        return 0;
}

export function convertToPARAM(x:string){
    const r = x.replace(" ","_").replace('ç','c').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return r;
}


export function Excel(data: any[], filename: string = 'data.xlsx') {
    // Criando uma nova planilha do Excel
    const campaignsData = data;
    console.log(data);
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(campaignsData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Campaign Data');

    // Generate a Blob object containing the workbook
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Save the Blob object as a file using FileSaver.js
    saveAs(blob, filename);
}

export const firstCharUpper = (string:string)=>{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const singularWord = (string:string)=>{
    return string.slice(0,string.length-1)
}

export const TZtoFriendlyDate = (string:string)=>{
    const isoDateString = string;
    const date = new Date(isoDateString);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
}

export function areAllValuesEmptyArrays(obj: { [key: string]: any[] }): boolean {
    return Object.values(obj).every(value => Array.isArray(value) && value.length === 0);
}