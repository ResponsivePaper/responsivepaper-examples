/****** Script for SelectTopNRows command from SSMS  ******/

/****** Script for SelectTopNRows command from SSMS  ******/
SELECT [categoryID]
      ,[categoryName]
      ,[description]
  FROM [Northwind].[dbo].[Categories]
  FOR JSON PATH

SELECT [productID]
      ,[productName]
      ,[supplierID]
      ,[categoryID]
      ,[quantityPerUnit]
      ,[unitPrice]
      ,[unitsInStock]
      ,[unitsOnOrder]
      ,[reorderLevel]
      ,[discontinued]
  FROM [Northwind].[dbo].[Products]
  FOR JSON PATH

  select picture as '*'
  FROM [Northwind].[dbo].[Categories]
  for xml path('')
  