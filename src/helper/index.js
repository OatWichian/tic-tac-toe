const encodeFileBase64 = (file) => {
  let reader = new FileReader();
  if (file) {
    return new Promise(function (resolve, reject) {
      reader.onload = function (event) {
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
      reader.onerror = (error) => {
        reject('error: ', error);
      };
    });
  }
};

const convertFileSize = (bytes) => {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

const getIconFileAttachment = (file) => {
  const fileType = [
    { icon: 'image', fileType: 'svg,png,gif,jpg,jpeg' },
    { icon: 'assets/icons/fileattachment.jpg', fileType: 'pdf,zip,doc,docx,ppt,pptx,xls,xlsx' },
  ];
  try {
    const regex = new RegExp(`(${file})`);
    const fileTypes = fileType.filter(({ fileType }) => regex.test(fileType));
    if (fileTypes.length > 0) {
      return fileTypes[0].icon;
    } else {
      throw new Error('File type is not support this verse');
    }
  } catch (error) {
    console.error({ error });
  }

  return;
};

export { convertFileSize, encodeFileBase64, getIconFileAttachment };
