"use client";

import type React from "react";

import { useState } from "react";
import { Upload, FileSpreadsheet, RotateCcw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MultiSelect } from "@/components/multi-select";
import * as XLSX from "xlsx";

type TableRow = {
  srNo: string;
  date: string;
  vchNo: string;
  patient: string;
  patientAddr: string;
  patientMobile: string;
  doctor: string;
  doctorAddr: string;
  doctorTelephone: string;
  product: string;
  qty: string;
  unit: string;
  batch: string;
  hsnCode?: string;
};

interface BillData {
  date: string;
  billNo: string;
  partyName: string;
  gstNo: string;
  outOfState: string;
  gross: string;
  discAmt: string;
  others: string;
  adjAmt: string;
  cnAmt: string;
  gstAmt: string;
  tcs: string;
  saCnAmt: string;
  saReamt: string;
  roundOff: string;
  net: string;
  fivePercentTax: string;
  twopointfivePercentSGst: string;
  twopointfivePercentCGst: string;
  twelevePercentGst: string;
  sixPecentSGSt: string;
  sixPercentCGST: string;
  eighteenPercentGst: string;
  ninePercentSGst: string;
  ninePercentCGst: string;
  hsnCode?: string;
}

export default function SalesReportManager() {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [data2, setData2] = useState<BillData[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [mapLoading, setMapLoading] = useState<boolean>(false);
  const [hsnCode, setHsnCode] = useState("");
  const [storeInfo, setStoreInfo] = useState({
    name: "",
    address: "",
    mobile: "",
    reportTitle: "",
    dateRange: "",
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const html = e.target?.result as string;
      parseHTMLTable(html);
    };
    reader.readAsText(file);
  };

  const handleFileUpload2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const html = e.target?.result as string;
      parseHTMLTable2(html);
    };

    reader.readAsText(file);
  };

  const parseHTMLTable2 = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const row = doc.querySelectorAll("table tbody tr");

    row.forEach((item, index) => {
      if (index === 0) return;

      const cells = item.querySelectorAll("td");

      data2.push({
        date: cells[0]?.textContent?.trim() || "",
        billNo: cells[1]?.textContent?.trim() || "",
        partyName: cells[2]?.textContent?.trim() || "",
        gstNo: cells[3]?.textContent?.trim() || "",
        outOfState: cells[4]?.textContent?.trim() || "",
        gross: cells[5]?.textContent?.trim() || "",
        discAmt: cells[6]?.textContent?.trim() || "",
        others: cells[7]?.textContent?.trim() || "",
        adjAmt: cells[8]?.textContent?.trim() || "",
        cnAmt: cells[9]?.textContent?.trim() || "",
        gstAmt: cells[10]?.textContent?.trim() || "",
        tcs: cells[11]?.textContent?.trim() || "",
        saCnAmt: cells[12]?.textContent?.trim() || "",
        saReamt: cells[13]?.textContent?.trim() || "",
        roundOff: cells[14]?.textContent?.trim() || "",
        net: cells[15]?.textContent?.trim() || "",
        fivePercentTax: cells[16]?.textContent?.trim() || "",
        twopointfivePercentSGst: cells[17]?.textContent?.trim() || "",
        twopointfivePercentCGst: cells[18]?.textContent?.trim() || "",
        twelevePercentGst: cells[19]?.textContent?.trim() || "",
        sixPecentSGSt: cells[20]?.textContent?.trim() || "",
        sixPercentCGST: cells[21]?.textContent?.trim() || "",
        eighteenPercentGst: cells[22]?.textContent?.trim() || "",
        ninePercentSGst: cells[23]?.textContent?.trim() || "",
        ninePercentCGst: cells[24]?.textContent?.trim() || "",
      });
    });

    console.log("Data", data2);
  };

  const parseHTMLTable = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Extract store information
    const paragraphs = doc.querySelectorAll("p");
    if (paragraphs.length > 0) {
      const pText = paragraphs[0].textContent || "";
      const lines = pText.split("\n").filter((line) => line.trim());
      setStoreInfo({
        name: lines[0]?.trim() || "",
        address: lines.slice(1, -3).join(", ").trim() || "",
        mobile: lines[lines.length - 3]?.trim() || "",
        reportTitle: lines[lines.length - 2]?.trim() || "",
        dateRange: lines[lines.length - 1]?.trim() || "",
      });
    }

    // Extract table data
    const rows = doc.querySelectorAll("table tbody tr");
    const data: TableRow[] = [];
    const productSet = new Set<string>();

    rows.forEach((row, index) => {
      if (index === 0) return; // Skip header row

      const cells = row.querySelectorAll("td");
      if (cells.length >= 13) {
        const product = cells[9]?.textContent?.trim() || "";
        if (product) productSet.add(product);

        data.push({
          srNo: cells[0]?.textContent?.trim() || "-",
          date: cells[1]?.textContent?.trim() || "-",
          vchNo: cells[2]?.textContent?.trim() || "-",
          patient: cells[3]?.textContent?.trim() || "-",
          patientAddr: cells[4]?.textContent?.trim() || "-",
          patientMobile: cells[5]?.textContent?.trim() || "-",
          doctor: cells[6]?.textContent?.trim() || "-",
          doctorAddr: cells[7]?.textContent?.trim() || "-",
          doctorTelephone: cells[8]?.textContent?.trim() || "-",
          product: product,
          qty: cells[10]?.textContent?.trim() || "-",
          unit: cells[11]?.textContent?.trim() || "-",
          batch: cells[12]?.textContent?.trim() || "-",
          hsnCode: cells[13]?.textContent?.trim() || "-",
        });
      }
    });

    setTableData(data);
    setProducts(Array.from(productSet).sort());
  };

  const handleAddHSN = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hsnCode || selectedProducts.length === 0) return;

    setTableData((prev) =>
      prev.map((row) =>
        selectedProducts.includes(row.product) ? { ...row, hsnCode } : row
      )
    );

    setSelectedProducts([]);
    setHsnCode("");
  };

  const downloadHTML = () => {
    const htmlContent = generateHTMLTable();
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales-report.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadHTML2 = () => {
    MapHsn();
    const htmlContent = generateHTMLTable2();
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales-report.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      tableData.map((row) => ({
        "Sr No": row.srNo,
        Date: row.date,
        "Vch No": row.vchNo,
        Patient: row.patient,
        "Patient Address": row.patientAddr,
        "Patient Mobile": row.patientMobile,
        Doctor: row.doctor,
        "Doctor Address": row.doctorAddr,
        "Doctor Telephone": row.doctorTelephone,
        Product: row.product,
        Qty: row.qty,
        Unit: row.unit,
        Batch: row.batch,
        "HSN Code": row.hsnCode || "",
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Report");

    // Generate binary string and create blob for browser download
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales-report.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateHTMLTable = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${storeInfo.reportTitle}</title>
  <style>
    body { font-family: Arial, sans-serif; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #000; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    .header { text-align: center; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h2>${storeInfo.name}</h2>
    <p>${storeInfo.address}</p>
    <p>${storeInfo.mobile}</p>
    <h3>${storeInfo.reportTitle}</h3>
    <p>${storeInfo.dateRange}</p>
  </div>
  <table>
    <thead>
      <tr>
        <th>Sr No</th>
        <th>Date</th>
        <th>Vch No</th>
        <th>Patient</th>
        <th>Patient Address</th>
        <th>Patient Mobile</th>
        <th>Doctor</th>
        <th>Doctor Address</th>
        <th>Doctor Telephone</th>
        <th>Product</th>
        <th>Qty</th>
        <th>Unit</th>
        <th>Batch</th>
        <th>HSN Code</th>
      </tr>
    </thead>
    <tbody>
      ${tableData
        .map(
          (row) => `
        <tr>
          <td>${row.srNo}</td>
          <td>${row.date}</td>
          <td>${row.vchNo}</td>
          <td>${row.patient}</td>
          <td>${row.patientAddr}</td>
          <td>${row.patientMobile}</td>
          <td>${row.doctor}</td>
          <td>${row.doctorAddr}</td>
          <td>${row.doctorTelephone}</td>
          <td>${row.product}</td>
          <td>${row.qty}</td>
          <td>${row.unit}</td>
          <td>${row.batch}</td>
          <td>${row.hsnCode || ""}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
</body>
</html>
    `;
  };
  const generateHTMLTable2 = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${storeInfo.reportTitle}</title>
  <style>
    body { font-family: Arial, sans-serif; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #000; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    .header { text-align: center; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h2>${storeInfo.name}</h2>
    <p>${storeInfo.address}</p>
    <p>${storeInfo.mobile}</p>
    <h3>${storeInfo.reportTitle}</h3>
    <p>${storeInfo.dateRange}</p>
  </div>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Bill No</th>
        <th>Party Name</th>
        <th>Gst No </th>
        <th>Out of State</th>
        <th>Gross</th>
        <th>Disc Amt</th>
        <th>Others</th>
        <th>Adj Amt</th>
        <th>CN Amt</th>
        <th>Gst Amt</th>
        <th>TCS</th>
        <th>SaCNAdjAmt</th>
        <th>SaRe Amt</th>
        <th>Round Off</th>
        <th>Net</th>
        <th>5% Taxable</th>
        <th>2.5% SGST Tax</th>
        <th>2.5% CGST Tax</th>
        <th>12% Taxable</th>
        <th>6% SGST Tax</th>
        <th>6% CGST Tax</th>
        <th>18% Taxable</th>
        <th>9% SGST TAX</th>
        <th>9% CGST Tax</th>
        <th>HSN Code</th>


      </tr>
    </thead>
    <tbody>
      ${data2
        .map(
          (row) => `
        <tr>
          <td>${row.date}</td>
          <td>${row.billNo}</td>
          <td>${row.partyName}</td>

          <td>${row.gstNo}</td>
          <td>${row.outOfState}</td>
          <td>${row.gross}</td>

          <td>${row.discAmt}</td>
          <td>${row.others}</td>
          <td>${row.adjAmt}</td>

          <td>${row.cnAmt}</td>
          <td>${row.gstAmt}</td>
          <td>${row.tcs}</td>

          <td>${row.saCnAmt}</td>
          <td>${row.saReamt}</td>
          <td>${row.roundOff}</td>
          <td>${row.net}</td>

          <td>${row.fivePercentTax}</td>
          <td>${row.twopointfivePercentSGst}</td>
          <td>${row.twopointfivePercentCGst}</td>

          <td>${row.twelevePercentGst}</td>
          <td>${row.sixPecentSGSt}</td>
          <td>${row.sixPercentCGST}</td>

          <td>${row.eighteenPercentGst}</td>
          <td>${row.ninePercentSGst}</td>
          <td>${row.ninePercentCGst}</td>

          <td>${row.hsnCode}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
</body>
</html>
    `;
  };

  const downloadExcel2 = () => {
    const ws = XLSX.utils.json_to_sheet(
      data2.map((row) => ({
        Date: row.date,
        "Bill No": row.billNo,
        "Party Name": row.partyName,
        "GST No": row.gstNo,
        "Out of State": row.outOfState,
        Gross: row.gross,
        "Disc Amt": row.discAmt,
        Others: row.others,
        "Adj Amt": row.adjAmt,
        "CN Amt": row.cnAmt,
        "GST Amt": row.gstAmt,
        TCS: row.tcs,
        "SaCN Adj Amt": row.saCnAmt,
        "SaRe Amt": row.saReamt,
        "Round Off": row.roundOff,
        Net: row.net,
        "5% Taxable": row.fivePercentTax,
        "2.5% SGST Tax": row.twopointfivePercentSGst,
        "2.5% CGST Tax": row.twopointfivePercentCGst,
        "12% Taxable": row.twelevePercentGst,
        "6% SGST Tax": row.sixPecentSGSt,
        "6% CGST Tax": row.sixPercentCGST,
        "18% Taxable": row.eighteenPercentGst,
        "9% SGST Tax": row.ninePercentSGst,
        "9% CGST Tax": row.ninePercentCGst,
        "HSN Code": Array.isArray(row.hsnCode)
          ? row.hsnCode.join(", ")
          : row.hsnCode ?? "",
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Report");

    // Generate binary string and create blob for browser download
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales-report.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetTable = () => {
    setTableData([]);
    setProducts([]);
    setSelectedProducts([]);
    setHsnCode("");
    setStoreInfo({
      name: "",
      address: "",
      mobile: "",
      reportTitle: "",
      dateRange: "",
    });
  };

  const productsWithHSN = tableData
    .filter((row) => row.hsnCode)
    .map((row) => row.product);
  const uniqueProductsWithHSN = Array.from(new Set(productsWithHSN));
  const productsWithoutHSN = products.filter(
    (p) => !uniqueProductsWithHSN.includes(p)
  );

  const MapHsn = () => {
    setMapLoading(true);

    data2.forEach((item) => {
      const hsnData = tableData.filter((items) => items.vchNo === item.billNo);

      const hsnArr = hsnData.map((el) => el.hsnCode);

      item.hsnCode = hsnArr.join(", ");
    });

    console.log("mapped data2", data2);
    setMapLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">
            Sales Report Manager
          </h1>
          <p className="text-slate-400">
            Upload, manage HSN codes, and export your sales data
          </p>
        </div>

        {/* Upload Section */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="h-5 w-5 text-emerald-400" />
              Upload Sales Report
            </CardTitle>
            <CardDescription className="text-slate-400">
              Upload your HTML sales report file to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <Input
                type="file"
                accept=".html,.htm"
                onChange={handleFileUpload}
                className="bg-slate-800 border-slate-700 text-white file:bg-emerald-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-md file:mr-4"
              />
              <Upload className="h-5 w-5 text-emerald-400" />
              <span className="text-white font-bold">
                upload file for without product details
              </span>
              <Input
                type="file"
                accept=".html,.htm"
                onChange={handleFileUpload2}
                className="bg-slate-800 border-slate-700 text-white file:bg-emerald-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-md file:mr-4"
              />
              {tableData.length > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30"
                >
                  {tableData.length} rows loaded
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {tableData.length > 0 && (
          <>
            {/* HSN Code Form */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">
                  Add HSN Code to Products
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Select products and assign HSN codes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddHSN} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="products" className="text-white">
                      Select Products
                    </Label>
                    <MultiSelect
                      options={products}
                      selected={selectedProducts}
                      onChange={setSelectedProducts}
                      placeholder="Search and select products..."
                      className="w-full"
                    />
                    {selectedProducts.length > 0 && (
                      <p className="text-sm text-emerald-400">
                        {selectedProducts.length} product(s) selected
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hsn" className="text-white">
                      HSN Code
                    </Label>
                    <Input
                      id="hsn"
                      type="number"
                      value={hsnCode}
                      onChange={(e) => setHsnCode(e.target.value)}
                      placeholder="Enter HSN code"
                      className="bg-slate-800 border-slate-700 text-white"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={selectedProducts.length === 0 || !hsnCode}
                  >
                    Add HSN Code
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Product Status */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    Products with HSN Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {uniqueProductsWithHSN.length > 0 ? (
                      uniqueProductsWithHSN.map((product) => (
                        <div
                          key={product}
                          className="flex items-center justify-between p-2 bg-emerald-900/20 rounded border border-emerald-800/30"
                        >
                          <span className="text-sm text-slate-300">
                            {product}
                          </span>
                          <Badge className="bg-emerald-600 text-white">
                            {
                              tableData.find((row) => row.product === product)
                                ?.hsnCode
                            }
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm">
                        No products with HSN codes yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    Products without HSN Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {productsWithoutHSN.length > 0 ? (
                      productsWithoutHSN.map((product) => (
                        <div
                          key={product}
                          className="p-2 bg-slate-800/50 rounded border border-slate-700"
                        >
                          <span className="text-sm text-slate-300">
                            {product}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-emerald-400 text-sm">
                        All products have HSN codes!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={downloadHTML}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Download HTML
              </Button>
              <Button
                onClick={downloadExcel}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Download Excel
              </Button>
              <Button
                onClick={downloadExcel2}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Download Excel 2
              </Button>
              
              <Button
                onClick={resetTable}
                variant="destructive"
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Table
              </Button>
              <Button
                onClick={MapHsn}
                disabled={mapLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {mapLoading ? (
                  "Mapping"
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Map HTML
                  </>
                )}
              </Button>
              <Button
                onClick={downloadHTML2}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Download HTML 2
              </Button>
            </div>

            {/* Table Display */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Sales Report Data</CardTitle>
                {storeInfo.name && (
                  <div className="text-center pt-4 space-y-1">
                    <h3 className="text-lg font-bold text-white">
                      {storeInfo.name}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {storeInfo.address}
                    </p>
                    <p className="text-sm text-slate-400">{storeInfo.mobile}</p>
                    <p className="text-sm font-semibold text-white">
                      {storeInfo.reportTitle}
                    </p>
                    <p className="text-sm text-slate-400">
                      {storeInfo.dateRange}
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left p-2 text-slate-300 font-semibold whitespace-nowrap">
                          Sr No
                        </th>
                        <th className="text-left p-2 text-slate-300 font-semibold whitespace-nowrap">
                          Date
                        </th>
                        <th className="text-left p-2 text-slate-300 font-semibold whitespace-nowrap">
                          Vch No
                        </th>
                        <th className="text-left p-2 text-slate-300 font-semibold whitespace-nowrap">
                          Patient
                        </th>
                        <th className="text-left p-2 text-slate-300 font-semibold whitespace-nowrap">
                          Patient Address
                        </th>
                        <th className="text-left p-2 text-slate-300 font-semibold whitespace-nowrap">
                          Patient Mobile
                        </th>
                        <th className="text-left p-2 text-slate-300 font-semibold whitespace-nowrap">
                          Doctor
                        </th>
                        <th className="text-left p-2 text-slate-300 font-semibold whitespace-nowrap">
                          Doctor Address
                        </th>
                        <th className="text-left p-2 text-slate-300 font-semibold whitespace-nowrap">
                          Doctor Telephone
                        </th>
                        <th className="text-left p-2 text-slate-300 font-semibold whitespace-nowrap">
                          Product
                        </th>
                        <th className="text-left p-2 text-slate-300 font-semibold whitespace-nowrap">
                          Qty
                        </th>
                        <th className="text-left p-2 text-slate-300 font-semibold whitespace-nowrap">
                          Unit
                        </th>
                        <th className="text-left p-2 text-slate-300 font-semibold whitespace-nowrap">
                          Batch
                        </th>
                        <th className="text-left p-2 text-slate-300 font-semibold whitespace-nowrap">
                          HSN Code
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, index) => (
                        <tr
                          key={index}
                          className="border-b border-slate-800 hover:bg-slate-800/30"
                        >
                          <td className="p-2 text-slate-400 whitespace-nowrap">
                            {row.srNo}
                          </td>
                          <td className="p-2 text-slate-400 whitespace-nowrap">
                            {row.date}
                          </td>
                          <td className="p-2 text-slate-400 whitespace-nowrap">
                            {row.vchNo}
                          </td>
                          <td className="p-2 text-slate-400 whitespace-nowrap">
                            {row.patient}
                          </td>
                          <td className="p-2 text-slate-400 whitespace-nowrap">
                            {row.patientAddr}
                          </td>
                          <td className="p-2 text-slate-400 whitespace-nowrap">
                            {row.patientMobile}
                          </td>
                          <td className="p-2 text-slate-400 whitespace-nowrap">
                            {row.doctor}
                          </td>
                          <td className="p-2 text-slate-400 whitespace-nowrap">
                            {row.doctorAddr}
                          </td>
                          <td className="p-2 text-slate-400 whitespace-nowrap">
                            {row.doctorTelephone}
                          </td>
                          <td className="p-2 text-slate-400 whitespace-nowrap">
                            {row.product}
                          </td>
                          <td className="p-2 text-slate-400 whitespace-nowrap">
                            {row.qty}
                          </td>
                          <td className="p-2 text-slate-400 whitespace-nowrap">
                            {row.unit}
                          </td>
                          <td className="p-2 text-slate-400 whitespace-nowrap">
                            {row.batch}
                          </td>
                          <td className="p-2 whitespace-nowrap">
                            {row.hsnCode ? (
                              <Badge className="bg-emerald-600 text-white">
                                {row.hsnCode}
                              </Badge>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
