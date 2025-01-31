//const domain = 'https://amazon-s3-images-e9b9e7a23b73.herokuapp.com';
//const domain = 'http://127.0.0.1:5000';

//const domain = 'http://5.230.249.73:5003';
const domain = 'https://miramaruae.co';

const loginUrl = domain + '/login';
const uploadFileUrl = domain + '/upload-file';
const deleteUrl = domain + '/delete-file';
const moveUrl = domain + '/move-file';
const createFolderUrl = domain + '/create-folder';
const getSignedUrlUrl = domain + '/get-signed-url';




const fs = require('fs');
async function convertToBase64(filePath){
    const buffer = fs.readFileSync(filePath);
    const base64String_ = buffer.toString('base64');
    return base64String_;
}


var tokenG = null;
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
            file_type: fileType, //'pdf'/'image'/'audio'/'video'
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

const { Blob } = require('buffer'); // Use Blob for handling binary data
async function convertPdf(pdfFile) {
    try {
        // Read the PDF file as binary
        const pdfData = fs.readFileSync(pdfFile);

        // Create a Blob from the PDF data
        const pdfBlob = new Blob([pdfData], { type: 'application/pdf' });
        const response = await fetch(domain + '/dont-allow-copy-pdf', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tokenG}`,
                'Content-Type': 'application/pdf'
            },
            body: pdfBlob
        });

        if(!response.ok) throw new Error(`Error: ${response.statusText}`);

        // save
        fs.writeFileSync('processed_' + pdfFile, Buffer.from(await response.arrayBuffer()));
        console.log(`ok`);
    } catch (error) {
        console.error('Error processing PDF:', error.message);
    }
}



async function main(){
    await login('accounting_user', 'qd5wlsm@aqno13v6o');
    console.log(tokenG);

    var base64str = await convertToBase64('5ff34ca.jpg');
    //await uploadFile(base64str, 1903, 181016, 'miram8ar-7-maint', 'main', 'pic-71-5', 'hr-folder-contracts', 'image', true);

    await getSignedUrl('https://hr-folder-contracts.s3.ap-south-1.amazonaws.com/807/171795142_931691496_411184903_&MOHAMMAD-ABDAL-MONEM-MOHAMAD-SHATNAWI&_$cancellation of visa$Employment Visa Cancellation Letter (3) (1).pdf$27-12-2024$-NpAyyV.pdf');

    //await convertPdf('go.pdf')
}

main();
