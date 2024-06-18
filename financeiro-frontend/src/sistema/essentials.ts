/* eslint-disable no-var */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */

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
    if (!string){
        return "";
    }
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

export function isStringDate(value:string | number){

    if (typeof value !== "string"){
        return false;
    }else{
        const regex = /^\d{4}-\d{2}-\d{2}/;
        return !!regex.test(value)
    }
}

export function areAllValuesEmptyArrays(obj: { [key: string]: any[] }): boolean {
    return Object.values(obj).every(value => Array.isArray(value) && value.length === 0);
}

export function areAllValuesUndefined(obj: ({ [key: string | number]: any[] }|null)): boolean {
    if(obj===null){
        return false;
    }
    return Object.values(obj).every(value => value === undefined);
}

export function BRLReais(valor:number|null|undefined){
    if(!valor){
        return "R$ 0,00";
    }
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function SubtractColumns(ObjectArray:{[key:string]:any}[],column1:string,column2:string){
    let subtraction;
    if(!ObjectArray?.length){
        subtraction=0;
        return;
    }
    if((ObjectArray[0].hasOwnProperty(column1) && ObjectArray[0].hasOwnProperty(column2))){
        subtraction =  ObjectArray.map((e)=>{
            if(e[column1] && e[column1]){
                return e[column1] - e[column2]
            }else{
                return 0;
            }
        }).reduce((prev,current)=>prev+current,0)
    }
    return subtraction;
}