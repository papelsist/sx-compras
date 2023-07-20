package com.cfdi4

import javax.xml.datatype.DatatypeFactory
import javax.xml.datatype.XMLGregorianCalendar
import java.text.SimpleDateFormat


class DateUtils {


    public static XMLGregorianCalendar getXmlGregorianCalendar(Date fecha){
        GregorianCalendar cal = new GregorianCalendar()
        cal.setTime(fecha)
        XMLGregorianCalendar xmlGregorianCalendar = DatatypeFactory.newInstance().newXMLGregorianCalendar(cal)
        return xmlGregorianCalendar
    }


    final static SimpleDateFormat CFDI_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss")

    public static getCfdiDate(Date date){
        return  CFDI_DATE_FORMAT.format(date)
    }

    public static Date toDate(String cfdiDate){
        return CFDI_DATE_FORMAT.parse(cfdiDate)
    }
}
