//domain = 'https://www.jungleclock.com'
domain = 'http://127.0.0.1:5000';

var tokenG = null;

const loginUrl = domain + '/login';
const uploadFileUrl = domain + '/upload-file';
const deleteUrl = domain + '/delete-file';
const moveUrl = domain + '/move-file';
const createFolderUrl = domain + '/create-folder';
const getSignedUrlUrl = domain + '/get-signed-url';

//--------------------------------------
const path = require('path');
//-------------------------------------------



const fs = require('fs');
async function convertToBase64(){
    const buffer = fs.readFileSync('ai.pdf');
    const base64String_ = buffer.toString('base64');
    return base64String_;
}


async function login(userName, passWord){
    const credentials = {
        username: userName,
        password: passWord
    };
    try{
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        if(response.ok){
            const data = await response.json();
            tokenG = data.res;
            //console.log(tokenG);
        }
        else{
            console.log('Authentication failed:', response.status);
        }
    }
    catch(error){
        console.log('Error during authentication:', error);
    }
}


async function uploadFile(base64str, unitNumber, snNumber, location, mainOrAny, folderName, bucketName, fileType, isPrivate){
    const token = tokenG;

    if(token){
        const postData = {
            base64str: base64str,
            unit_number: unitNumber,
            sn_number: snNumber,
            location: location,
            main_or_any: mainOrAny,
            folder_name: folderName,// folder name can be ''
            bucket_name: bucketName,
            file_type: fileType, //'pdf'/'image'/'audio'
            is_private: isPrivate //true/false
        };

        postProtectedData(uploadFileUrl, token, postData);
    }
}


async function getSignedUrl(objectKey){
    const token = tokenG;
    if(token){

        postData = {
            object_key: objectKey 
        };
        postProtectedData(getSignedUrlUrl, token, postData);
    }
}



async function deleteFile(fileUrl){
    const token = tokenG;
    if(token){
        const postData = {
            file_url: fileUrl
        };
        postProtectedData(deleteUrl, token, postData);
    }
}


async function MoveFile(fileUrl, destinationBucket){
    const token = tokenG;
    if(token){
        const postData = {
            file_url: fileUrl,
            destination_bucket: destinationBucket
        };
        postProtectedData(moveUrl, token, postData);
    }
}

async function createFolder(bucketName, folderName){
    const token = tokenG;
    if(token){
        const postData = {
            bucket_name: bucketName,
            folder_name: folderName//'hello/how/are/you'
        };
        postProtectedData(createFolderUrl, token, postData);
    }
}


async function postProtectedData(uploadDataUrl, token, postData){
    try {
        const response = await fetch(uploadDataUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(postData),
        });

        if(response.ok){
            const result = await response.json();
            console.log(result.res);
        }
        else{
            const errorResult = await response.json(); // Parse the response body
            console.log(errorResult.error); // Log the error message
        }
    }
    catch(error){
        console.log(error);
    }
}



//-------------------------------------------------------------------------------
const http = require('http'); // Use http instead of https


async function uploadPdf(pdfPath) {
    const pdfBlob = fs.readFileSync(pdfPath);

    const options = {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/dont-allow-copy-pdf',
        method: 'POST',
        headers: {
            'Content-Type': 'application/pdf',
            'Authorization': `Bearer ${tokenG}`,
            'Content-Length': pdfBlob.length,
        },
    };

    const req = http.request(options, (res) => {
        let data = [];

        res.on('data', (chunk) => {
            data.push(chunk);
        });

        res.on('end', () => {
            const resultBuffer = Buffer.concat(data);
            fs.writeFileSync('processed.pdf', resultBuffer);
            console.log('Processed PDF saved as processed.pdf');
        });
    });

    req.on('error', (error) => {
        console.error('Error uploading PDF:', error);
    });

    req.write(pdfBlob);
    req.end();
}
//------------------------------------------------------------------------------

async function main(){
    await login('accounting_user', 'qd5wlsm@aqno13v6o');
    //console.log(tokenG);
    //var base64str = await convertToBase64();

    //await uploadFile(base64str, 101, 151116, 'reem_issland', 'main-or-any-777', 'f', 'hr-folder-contracts', 'pdf', false);
    //await getSignedUrl('https://zahi-mohamed.s3.ap-south-1.amazonaws.com/folder-1302/735118458_403101098_reem_island_main-or-any-7.jpeg');
    //const pdfPath = path.join(__dirname, 'ai.pdf'); // Replace with your PDF file path
    //await uploadPdf(pdfPath);

}

main();
