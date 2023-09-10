import {Box, Text, useColorModeValue, Wrap, WrapItem, Badge, Link, Button} from "@chakra-ui/react";
import { CCardBody, CSmartTable } from '@coreui/react-pro';
import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Spinner } from "@chakra-ui/react";

const statusArr = ['Final', 'Draft', 'Review', 'Last_Call', 'Stagnant', 'Withdrawn', 'Living']

interface EIP {
  _id: string;
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: string;
  discussion: string;
  deadline: string;
  requires: string;
  unique_ID: number;
  __v: number;
}

import '@coreui/coreui/dist/css/coreui.min.css';
import LoaderComponent from "./Loader";
import {DownloadIcon} from "@chakra-ui/icons";
interface TabProps {
    cat: string;
  }


const TableStat: React.FC<TabProps> = ({cat})  => {
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const factorAuthor = (data: any) => {
    let list = data.split(',');
    for (let i = 0; i < list.length; i++) {
      list[i] = list[i].split(' ');
    }
    if (list[list.length - 1][list[list.length - 1].length - 1] === 'al.') {
      list.pop();
    }
    return list;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/alleips`);
        const jsonData = await response.json();
        setData(jsonData);
        setIsLoading(false); // Set isLoading to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set isLoading to false if there's an error
      }
    };
    fetchData();
  }, []);

  useEffect(()=> {
    if(bg === "#f6f6f7") {
      setIsDarkMode(false);
    } else {
        setIsDarkMode(true);
    }
  })

  const filteredData = data
  .map((item: any) => {
    const { eip, title, author, status, type, category } = item;
    return {
      eip,
      title,
      author,
      status,
      type,
      category,
    };
  })
  .filter((item: any) => item.status === cat);

  const bg = useColorModeValue("#f6f6f7", "#171923");

  const convertAndDownloadCSV = () => {
    if (filteredData && filteredData.length > 0) {
      // Create CSV headers
      const headers = Object.keys(filteredData[0]).join(',') + '\n';

      // Convert data to CSV rows
      const csvRows = filteredData.map((item) =>
          Object.values(item)
              .map((value) => (typeof value === 'string' && value.includes(',')
                  ? `"${value}"`
                  : value))
              .join(',')
      );

      // Combine headers and rows
      const csvContent = headers + csvRows.join('\n');

      // Trigger CSV download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${cat}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };


  return (
    <Box
    bgColor={bg}
    marginTop={"12"}
    p="1rem 1rem"
    borderRadius="0.55rem"
    _hover={{
      border: "1px",
      borderColor: "#30A0E0",
    }}
    as={motion.div}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 } as any}
    className=" ease-in duration-200"
  >
      <Box>
        <Button colorScheme="blue" variant="outline" fontSize={'14px'} fontWeight={'bold'} padding={'10px 20px'} onClick={convertAndDownloadCSV}>
          <DownloadIcon marginEnd={'1.5'} />
          Download Reports
        </Button>
      </Box>

      <CCardBody
        style={{
          fontSize: '13px',
        }}
        className="scrollbarDesign"
      >
        {isLoading ? ( // Show loader while data is loading
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
           <Spinner/>
          </Box>
        ) : (
          <CSmartTable
          items={filteredData.sort((a, b) => parseInt(a.eip) - parseInt(b.eip))}
            activePage={1}
            clickableRows
            columnFilter
            columnSorter
            itemsPerPage={7}
            pagination
            tableProps={{
              hover: true,
              responsive: true,
            }}
            scopedColumns={{
              eip: (item: any) => (
                  <td key={item.eip}>
                    <Link href={`/EIPS/${item.eip}`}>
                      <Wrap>
                        <WrapItem>
                          <Badge colorScheme={getStatusColor(item.status)}>{item.eip}</Badge>
                        </WrapItem>
                      </Wrap>
                    </Link>
                  </td>
              ),
              title: (item: any) => (
                  <td key={item.eip} style={{ fontWeight: 'bold', height: '100%' }} className="hover:text-[#1c7ed6]">
                    <Link href={`/EIPS/${item.eip}`} className={isDarkMode? "hover:text-[#1c7ed6] text-[13px] text-white" : "hover:text-[#1c7ed6] text-[13px] text-black"}>
                      {item.title}
                    </Link>
                  </td>
              ),
              author: (it: any) => (
                  <td key={it.author}>
                    <div>
                      {factorAuthor(it.author).map((item: any, index: any) => {
                        let t = item[item.length - 1].substring(1, item[item.length - 1].length - 1);
                        return (
                            <Wrap key={index}>
                              <WrapItem>
                              <Link href={`${
                          item[item.length - 1].substring(item[item.length - 1].length - 1) ===
                          '>'
                            ? 'mailto:' + t
                            : 'https://github.com/' + t.substring(1)
                        }`} target="_blank" className={isDarkMode? "hover:text-[#1c7ed6] text-[13px] text-white" : "hover:text-[#1c7ed6] text-[13px] text-black"}>
                                {item}
                                </Link>
                              </WrapItem>
                            </Wrap>
                        );
                      })}
                    </div>
                  </td>
              ),
              type: (item: any) => (
                  <td key={item.eip} className={isDarkMode ? "text-white" : "text-black"}>
                    {item.type}
                  </td>
              ),
              category: (item: any) => (
                  <td key={item.eip} className={isDarkMode ? "text-white" : "text-black"}>
                    {item.category}
                  </td>
              ),
              status: (item: any) => (
                  <td key={item.eip}>
                    <Wrap>
                      <WrapItem>
                        <Badge colorScheme={getStatusColor(item.status)}>{item.status}</Badge>
                      </WrapItem>
                    </Wrap>
                  </td>
              ),
            }}
          />
        )}
      </CCardBody>
    </Box>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Living":
      return "blue";
    case "Final":
      return "blue";
    case "Stagnant":
      return "purple";
    case "Draft":
      return "orange"
    case "Withdrawn":
      return "red"
    case "Last Call":
      return "yellow"
    default:
      return "gray";
  }
};

export default TableStat;