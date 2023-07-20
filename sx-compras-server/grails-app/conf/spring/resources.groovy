import sx.security.UserPasswordEncoderListener


import com.cfdi4.Cfdi4FacturaBuilder
import com.cfdi4.CfdiSellador4
import com.cfdi4.CfdiCadenaBuilder4
import com.cfdi4.CfdiTrasladoBuilder
import com.cfdi4.Cfdi4NotaBuilder
import com.cfdi4.Cfdi4NotaDeCargoBuilder
import com.cfdi4.Cfdi4PagoBuilder


// Place your Spring DSL code here
beans = {
    userPasswordEncoderListener(UserPasswordEncoderListener)

  cfdiCadenaBuilder4(CfdiCadenaBuilder4){}

  cfdiSellador4(CfdiSellador4){
      cfdiCadenaBuilder4 = ref('cfdiCadenaBuilder4')
  }

  cfdi4FacturaBuilder(Cfdi4FacturaBuilder) {
      cfdiSellador4= ref('cfdiSellador4')
  } 

  cfdiTrasladoBuilder(CfdiTrasladoBuilder) {
      cfdiSellador4= ref('cfdiSellador4')
  }
  
  cfdi4NotaBuilder(Cfdi4NotaBuilder) {
    cfdiSellador4= ref('cfdiSellador4')
  }

  cfdi4NotaDeCargoBuilder(Cfdi4NotaDeCargoBuilder) {
    cfdiSellador4= ref('cfdiSellador4')
  }

  cfdi4PagoBuilder(Cfdi4PagoBuilder) {
    cfdiSellador4= ref('cfdiSellador4')
  }
}
