Attribute VB_Name = "JSON"
'THIS IS THE MAIN ONE FOR GETTING THE DICT FROM FILE
Function getDictFromFile(filePath As String) As Dictionary
      Dim json As String: json = readJSONFromFile(filePath)
      
      Set getDictFromFile = ParseJson(json)
End Function
Function readJSONFromFile(filePath As String) As String
      Dim textline As String
      Dim text As String
      
      Open filePath For Input As #1
      
      Do Until EOF(1)
            Line Input #1, textline
            text = text & textline
      Loop
      
      Close #1
      
      readJSONFromFile = text
End Function
Function ParseJson(json As String) As Dictionary
      Set ParseJson = JsonConverter.ParseJson(json)
End Function
'THIS IS THE MAIN ONE FOR WRITING DICT TO FILE
Sub writeDictToFile(dict As Dictionary, filePath As String)
      Dim json As String: json = JSONstringify(dict)
      
      writeToFile json, filePath
End Sub
Function JSONstringify(dict As Dictionary) As String
      JSONstringify = JsonConverter.ConvertToJson(dict, 4)
End Function
Sub writeToFile(data As String, filePath As String)

      n = FreeFile()
      
      Open filePath For Output As #n
      
      Print #n, data
      
      Close #n
End Sub

