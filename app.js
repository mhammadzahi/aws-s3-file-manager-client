
//domain = 'http://127.0.0.1:5000';
//domain = 'http://83.110.74.122:5001'; // miramar-server
domain = 'https://propertymart.site';
//domain = 'https://amazon-s3-images-e9b9e7a23b73.herokuapp.com';


const uploadFileUrl = domain + '/upload-file';
const deleteUrl = domain + '/delete-file';
// const moveUrl = domain + '/move-file';
// const createFolderUrl = domain + '/create-folder';
// const getSignedUrlUrl = domain + '/get-signed-url';

const apiKey = "gpoB54Jew95kYLTm6DWZXdXyhI6";
// const apiKey = "4lUMBEvBEs7x1Oe7QOEw7xeB350";
// const apiKey = "HKLQB6iM5EWI62bTgjTzHvs2F2q";



//const path = require('path');
const fs = require('fs');

async function convertToBase64(filePath) {
    const buffer = fs.readFileSync(filePath);
    const base64String_ = buffer.toString('base64');
    return base64String_;
}



async function uploadFile(base64str, unitNumber, snNumber, location, mainOrAny, folderName, bucketName, fileType, isPrivate) {
    const token = apiKey;

    if (token) {
        const postData = {
            base64str: base64str,
            unit_number: unitNumber,
            sn_number: snNumber,
            location: location,
            main_or_any: mainOrAny,
            folder_name: folderName,// folder name can be ''
            bucket_name: bucketName,
            file_type: fileType, //'pdf'/'image'/'audio'/'video'
            is_private: isPrivate //true/false
        };

        postProtectedData(uploadFileUrl, token, postData);
    }
}




async function deleteFile(fileUrl) {
    const token = apiKey;
    if (token) {
        const postData = {
            file_url: fileUrl
        };
        postProtectedData(deleteUrl, token, postData);
    }
}



// async function getSignedUrl(objectKey) {
//     const token = apiKey;
//     if (token) {

//         postData = {
//             object_key: objectKey
//         };
//         postProtectedData(getSignedUrlUrl, token, postData);
//     }
// }



// async function MoveFile(fileUrl, destinationBucket){
//     const token = apiKey;
//     if(token){
//         const postData = {
//             file_url: fileUrl,
//             destination_bucket: destinationBucket
//         };
//         postProtectedData(moveUrl, token, postData);
//     }
// }

// async function createFolder(bucketName, folderName){
//     const token = apiKey;
//     if(token){
//         const postData = {
//             bucket_name: bucketName,
//             folder_name: folderName//'hello/how/are/you'
//         };
//         postProtectedData(createFolderUrl, token, postData);
//     }
// }


async function postProtectedData(uploadDataUrl, token, postData) {
    try {
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(postData),
        }
        //console.log(params);
        const response = await fetch(uploadDataUrl, params);

        if (response.ok) {
            const result = await response.json();
            console.log(result.res);
        }
        else {
            const errorResult = await response.json(); // Parse the response body
            console.log(errorResult.error); // Log the error message
        }
    }
    catch (error) {
        console.log(error);
    }
}


// const { Blob } = require('buffer'); // Use Blob for handling binary data
// async function convertPdf(pdfFile) {
//     try {
//         // Read the PDF file as binary
//         const pdfData = fs.readFileSync(pdfFile);

//         // Create a Blob from the PDF data
//         const pdfBlob = new Blob([pdfData], { type: 'application/pdf' });
//         const response = await fetch(domain + '/dont-allow-copy-pdf', {
//             method: 'POST',
//             headers: {
//                 'Authorization': apiKey,
//                 'Content-Type': 'application/pdf'
//             },
//             body: pdfBlob
//         });

//         if(!response.ok) throw new Error(`Error: ${response.statusText}`);

//         // save
//         fs.writeFileSync('processed_' + pdfFile, Buffer.from(await response.arrayBuffer()));
//         console.log(`ok`);
//     } catch (error) {
//         console.error('Error processing PDF:', error.message);
//     }
// }



async function main() {

    var base64str = await convertToBase64('aws-files/MiramarDemo.mp4');
    await uploadFile(base64str, 12409, 115952, 'location', 'main', 'public-files', 'rmboard', 'video', false);

    //await deleteFile('https://rmboard.s3.ap-south-1.amazonaws.com/pics-public/302031153_853518228_251103867_reem-island-abu-dhabi_any.jpeg')
    //await getSignedUrl('');
    //await convertPdf('go.pdf')
}

main();
