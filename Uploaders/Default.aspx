<%@ Page Language="C#" %>
<%@ Import Namespace="System.IO" %>
<script runat="server">
    protected void Page_Load(object sender, EventArgs e) {
        VerifyUploadedFile();
        CheckAndCreateRequiredFolders();
        SaveImageFileAndEchoItsUrl();
    }

    protected void VerifyUploadedFile() {
        var NeatEditorImageFile = Request.Files["NeatEditorImageFile"];
        
        if (NeatEditorImageFile == null) {
            Response.Flush();
            Response.End();
        }
        
        if (NeatEditorImageFile.ContentLength == 0) {
            Response.Flush();
            Response.End();
        }

        if (!HasFileValidImageExtention(NeatEditorImageFile.FileName)) {
            Response.Flush();
            Response.End();
        }
    }


    private bool HasFileValidImageExtention(string FilePath) {
        string[] ValidImageExtentions = new string[] { "jpg", "jpeg", "gif", "bmp", "png" };
        foreach (var ValidImageExtention in ValidImageExtentions) {
            if (FilePath.EndsWith("." + ValidImageExtention)) {
                return true;
            }
        }
        return false;
    }

    private void CheckAndCreateRequiredFolders() {
        string UplaodFolderPath = Server.MapPath("~/Uploaders/UplaodedFiles/");
        if (!Directory.Exists(UplaodFolderPath)) {
            Directory.CreateDirectory(UplaodFolderPath);
        }
    }


    private void SaveImageFileAndEchoItsUrl() {
        Random Randomizer = new Random();
        string RandomFileName = "NeatEditorImage_" + Randomizer.Next(1000000, 99999999).ToString();
        
        var NeatEditorImageFile = Request.Files["NeatEditorImageFile"];
        string NeatEditorImageFileExtention = Path.GetExtension(NeatEditorImageFile.FileName);
            
        string FileSavePath = Server.MapPath("~/Uploaders/UplaodedFiles/" + RandomFileName + NeatEditorImageFileExtention);
        if (File.Exists(FileSavePath)) {
            SaveImageFileAndEchoItsUrl();
        }

        NeatEditorImageFile.SaveAs(FileSavePath);

        string UploaderPageFileName = new FileInfo(this.Request.Url.LocalPath).Name;
        string SavedFileUrl = Request.Url.AbsoluteUri.Replace(UploaderPageFileName, "") + "UplaodedFiles/" + 
            RandomFileName + NeatEditorImageFileExtention;

        Response.Write( SavedFileUrl );
        Response.Flush();
        Response.End();
    }
</script>