import { HttpException, HttpStatus } from "@nestjs/common";

export const extensions = [
    "doc",
    "docx",
    "ppt",
    "pptx",
    "xls",
    "xlsm",
    "xlsx",
    "ods",
    "odt",
    "odp",
    "jpeg",
    "jpg",
    "png",
    "tif",
    "tiff",
    "bmp",
    "tga",
    "heic",
    "dicom",
    "dicm",
    "dcm",
    "pdf",
    "psd",
    "rtf",
    "txt",
    "wpd"
];

export const validPhotoExtensions = [
    "jpg",
    "png",
    "jpeg"
];

export function checkFileExtension(type, file) {
    const extension = file.split('.').pop();

    if(type === 'profile') {
        if(!validPhotoExtensions.includes(extension)) {
            throw new HttpException('Not a valid profile photo extension', HttpStatus.BAD_REQUEST);
        }
    } else {
        if(!extensions.includes(extension)) {
            throw new HttpException('Not a valid file extension', HttpStatus.BAD_REQUEST);
        }
    }
    return true;
    
}
