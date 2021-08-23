Option Explicit

Function GetDesktop() As String
    ' get path to desktop
    Dim oWSHShell As Object

    Set oWSHShell = CreateObject("WScript.Shell")
    GetDesktop = oWSHShell.SpecialFolders("Desktop")
    Set oWSHShell = Nothing
End Function

Function PrintHeader()
    Dim FileName As String
    
    FileName = GetDesktop & "\Map - " & Format(Now, "yyyymmddTHHmmss") & ".html"
    Open FileName For Output As #1
    
    Print #1, "<!DOCTYPE html>"
    Print #1, "<html>"
    Print #1, "  <head>"
    Print #1, "    <meta name=" + Chr$(34) + "viewport" + Chr$(34) + " content=" + Chr$(34) + "initial-scale=1.0, user-scalable=no" + Chr$(34) + ">"
    Print #1, "    <meta charset=" + Chr$(34) + "utf-8" + Chr$(34) + ">"
    Print #1, "    <title>Map Builder (Excel 1.10)</title>"
    Print #1, "    <link rel=" + Chr$(34) + "stylesheet" + Chr$(34) + " href=" + Chr$(34) + "https://gitcdn.link/repo/appulance/map-builder/master/mapbuilder.css" + Chr$(34) + ">"
    Print #1, "    <script src=" + Chr$(34) + "https://maps.googleapis.com/maps/api/js?key=AIzaSyAyIAdoJgloykh4k2ZcyMdwcOoSNqDcxoU" + Chr$(34) + "></script>"
    Print #1, "    <script src=" + Chr$(34) + "https://code.jquery.com/jquery-3.5.1.min.js" + Chr$(34) + "></script>"
    Print #1, "    <script src=" + Chr$(34) + "https://gitcdn.link/repo/appulance/map-builder/master/mapbuilder.js" + Chr$(34) + "></script>"
    Print #1, "    <script>"
    Print #1, "        function addMarkers() {"
    
    PrintHeader = FileName
    'Close #1
End Function

Function PrintFooter()
    Print #1, "    }"
    Print #1, "    </script>"
    Print #1, "  </head>"
    Print #1, "  <body>"
    Print #1, "    <form id=" + Chr$(34) + "map-form" + Chr$(34) + "><select multiple id=" + Chr$(34) + "timeline" + Chr$(34) + " size=" + Chr$(34) + "10" + Chr$(34) + "></select><select multiple id=" + Chr$(34) + "aliases" + Chr$(34) + " size=" + Chr$(34) + "10" + Chr$(34) + "></select></form>"
    Print #1, "    <div id=" + Chr$(34) + "map-canvas" + Chr$(34) + "></div>"
    Print #1, "  </body>"
    Print #1, "</html>"
    
    Close #1
End Function

Sub MapFromBrowser()
    Dim Row As Range
    Dim Label As String
    Dim LocationDT As String
    Dim LatLong() As String
    Dim Latitude As String
    Dim Longitude As String
    Dim FormattedLocationDT As String
    Dim FileName
    Dim Source As String
        
    ActiveSheet.Range("A1", ActiveCell.End(xlDown).End(xlToRight)).AutoFilter Field:=2, Criteria1:="AVL"
    
    If Selection.Columns.Count = 1 Then
        With ActiveSheet.UsedRange
            'Select all filtered cells
            .Offset(1).Resize(.Rows.Count - 1).SpecialCells(xlCellTypeVisible).Select
        End With
    End If
    
    FileName = PrintHeader
    
    For Each Row In Selection.Rows
        Source = Row.Cells(, 2).Text
        
        If Source <> "AVL" Then
            GoTo NextIteration
        End If
        
        LocationDT = Trim(Row.Cells(, 1).Text)
        LatLong() = Split(Trim(Row.Cells(, 3).Text), ", ")
        'MsgBox LatLong(0)
        'MsgBox LatLong(1)
        
        FormattedLocationDT = Format(LocationDT, "yyyy-mm-ddTHH:mm:ss")
        
        ' Replace first instance of "." with " " (remove last character of string)
        Latitude = Replace(Left(LatLong(0), Len(LatLong(0)) - 1), ".", "° ", , 1)
        Longitude = Replace(Left(LatLong(1), Len(LatLong(1)) - 1), ".", "° ", , 1)
                
        Latitude = Convert_Decimal(Latitude)
        Longitude = Convert_Decimal(Longitude)
        
        Label = Latitude & " " & Longitude & "\n" & Trim(Row.Cells(, 4).Text) & "\n" & LocationDT
        
        Print #1, "addMarker(" & Chr$(34) & -1 * Latitude & Chr$(34); ", " & Chr$(34) & Longitude & Chr$(34) & ", " + Chr$(34) + FormattedLocationDT + Chr$(34) + ", 'Single', " + Chr$(34) + Label + Chr$(34) + ");"
NextIteration:
    Next Row
    
    PrintFooter
    
    openInChrome FileName
End Sub

Sub MapFromBrowserWithVehicle()
    Dim Row As Range
    Dim Label As String
    Dim LocationDT As String
    Dim LatLong() As String
    Dim Latitude As String
    Dim Longitude As String
    Dim FormattedLocationDT As String
    Dim FileName
    Dim Source As String
    Dim Vehicle As String
        
    ActiveSheet.Range("A1", ActiveCell.End(xlDown).End(xlToRight)).AutoFilter Field:=2, Criteria1:="AVL"
    
    If Selection.Columns.Count = 1 Then
        With ActiveSheet.UsedRange
            'Select all filtered cells
            .Offset(1).Resize(.Rows.Count - 1).SpecialCells(xlCellTypeVisible).Select
        End With
    End If
    
    FileName = PrintHeader
    
    For Each Row In Selection.Rows
        Source = Row.Cells(, 2).Text
        
        If Source <> "AVL" Then
            GoTo NextIteration
        End If
        
        LocationDT = Trim(Row.Cells(, 1).Text)
        LatLong() = Split(Trim(Row.Cells(, 3).Text), ", ")
        'MsgBox LatLong(0)
        'MsgBox LatLong(1)
        
        FormattedLocationDT = Format(LocationDT, "yyyy-mm-ddTHH:mm:ss")
        
        ' Replace first instance of "." with " " (remove last character of string)
        Latitude = Replace(Left(LatLong(0), Len(LatLong(0)) - 1), ".", "° ", , 1)
        Longitude = Replace(Left(LatLong(1), Len(LatLong(1)) - 1), ".", "° ", , 1)
                
        Latitude = Convert_Decimal(Latitude)
        Longitude = Convert_Decimal(Longitude)
        
        Vehicle = Trim(Row.Cells(, 6).Text)
'        MsgBox Vehicle
        
        Label = Latitude & " " & Longitude & "\n" & Trim(Row.Cells(, 4).Text) & "\n" & LocationDT
        
        Print #1, "addMarker(" & Chr$(34) & -1 * Latitude & Chr$(34); ", " & Chr$(34) & Longitude & Chr$(34) & ", " + Chr$(34) + FormattedLocationDT + Chr$(34) + ", 'Single', " + Chr$(34) + Label + Chr$(34) + ");"
NextIteration:
    Next Row
    
    PrintFooter
    
    openInChrome FileName
End Sub


Function Convert_Decimal(Degree_Deg As String) As Double
   Dim degrees As Double
   Dim minutes As Double
   Dim seconds As Double
   
   Dim DegreesMinutes() As String
   
   DegreesMinutes() = Split(Degree_Deg, "° ", , 1)
   
   degrees = CDbl(DegreesMinutes(0))

   minutes = CDbl(DegreesMinutes(1)) / 60
   
   Convert_Decimal = degrees + minutes
End Function
'*****************************************************************************
Sub OnGoogleMapsButton(control As IRibbonControl)
    MapFromTableau
End Sub

Sub OnVisiCADButton(control As IRibbonControl)
    MapFromBrowser
End Sub


Sub MapFromTableau()
'
' This sub is notified when the user clicks the Google Maps button in the
' Add-Ins tab.
'
    Dim Row As Range
    Dim FileName As String
    Dim Label As String
    Dim LocationDT As String
    Dim Latitude As String
    Dim Longitude As String
    Dim Comment As String
    
    If Selection.Columns.Count = 1 Then
        ' automatically change formatting to LocationDT column:
        Range("$B:$B").NumberFormat = "dd/mm/yyyy HH:mm:ss"
        ' automatically select all data in table if no selection is made
        Range("A2", ActiveCell.End(xlDown).End(xlToRight)).Select
    End If
    
    ' Example; the following cells are in the active sheet:
        
    ' Not highlighted:
    
    '        A          B          C
    '   +----------+-------------+-------------+-----------+
    ' 1 | Latitude | LocationDT  | Longitude   | Label     | ...
    '   +----------+-------------+-------------+-----------+
    
    ' Highlighted:
    
    '   +----------+-----------+----------+-------------+
    ' 2 | -27.319  | 16/3/2020 | 152.866  | 4201051
    '   +----------+-----------+----------+-------------+
    ' 3 | -27.032  | 16/3/2020 | 152.867  | 4201051
    '   +----------+-----------+----------+-------------+
    ' 4 | -27.523  | 16/3/2020 | 152.868  | 4201051
    '   +----------+-----------+----------+-------------+

    If Selection.Columns.Count < 3 Then
        MsgBox "You need to highlight at least 3 columns; (A) the latitude and (B) the date time and the (C) longitude.", vbCritical + vbOKOnly
        Exit Sub
    End If
    
    If Selection.Columns.Count > 8 Then
        MsgBox "You can't highlight more than 8 columns: (A) the latitude, (B) the date-time, (C) the longitude, and five label columns.", vbCritical + vbOKOnly
        Exit Sub
    End If
    
    FileName = PrintHeader
        
    For Each Row In Selection.Rows
    
        ' Latitude = "42.3149"
        Latitude = Trim(Row.Cells(, 1).Text)
        
        If IsNumeric(Latitude) = False Then
            Row.Cells(, 1).Activate
            MsgBox "The latitude (in the active cell) needs to be numeric.", vbCritical + vbOKOnly
            Close #1
            Exit Sub
        End If
           
        ' LocationDT = 16/03/2020 10:23
        LocationDT = Trim(Row.Cells(, 2).Text)
        
        ' Longitude = "-83.0364"
        Longitude = Trim(Row.Cells(, 3).Text)
        
        If IsNumeric(Longitude) = False Then
            Row.Cells(, 3).Activate
            MsgBox "The longitude (in the active cell) needs to be numeric.", vbCritical + vbOKOnly
            Close #1
            Exit Sub
        End If
        
        Dim FormattedAlias, Alias, PTTID, Talkgroup, Site, FormattedLocationDT
        Alias = Trim(Row.Cells(, 4).Text)
        FormattedAlias = "Alias: " & Alias & "\n"
        PTTID = "PTTID: " & Trim(Row.Cells(, 5).Text) & "\n"
        Talkgroup = "" & Trim(Row.Cells(, 6).Text) & "\n"
        Site = "" & Trim(Row.Cells(, 7).Text) & "\n"
        FormattedLocationDT = Format(LocationDT, "yyyy-mm-ddTHH:mm:ss")
        
        If Trim(Row.Cells(, 8).Text) <> "" Then
            Comment = "\n" & Trim(Row.Cells(, 8).Text)
        End If
                
        Label = FormattedAlias & PTTID & Talkgroup & Site & LocationDT & Comment
        
        Print #1, "            addMarker(" & Latitude & ", " & Longitude; ", " + Chr$(34) + FormattedLocationDT + Chr$(34) + ", " + Chr$(34) + Alias + Chr$(34) + ", " + Chr$(34) + Label + Chr$(34) + ");"
    Next Row
    
    PrintFooter
    
    openInChrome (FileName)
    
    'ActiveWorkbook.FollowHyperlink Address:=FileName, NewWindow:=True
    
End Sub

Sub openInChrome(url)
  Dim chromePath As String
  chromePath = """C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"""
  Shell (chromePath & " -url " + Chr$(34) + url + Chr$(34))
End Sub
