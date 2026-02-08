import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { 
    padding: 50, 
    backgroundColor: '#FFFFFF', 
    fontFamily: 'Helvetica' 
  },
  header: { 
    borderBottom: 1, 
    borderColor: '#2D5A46', 
    marginBottom: 30, 
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  logo: {
    width: 50,
    height: 50,
    objectFit: 'contain',
    marginBottom: 5,
    // backgroundColor: 'red', // Removido conforme solicitado
  },
  brandName: { 
    fontSize: 24, 
    color: '#2D5A46', 
    fontWeight: 'bold',
    letterSpacing: 2
  },
  reportType: {
    fontSize: 9,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  section: { 
    marginBottom: 25 
  },
  sectionTitle: { 
    fontSize: 12, 
    color: '#2D5A46', 
    fontWeight: 'bold', 
    marginBottom: 10, 
    textTransform: 'uppercase',
    borderLeft: 3,
    borderColor: '#2D5A46',
    paddingLeft: 8
  },
  content: { 
    fontSize: 10, 
    color: '#444444', 
    lineHeight: 1.6, 
    textAlign: 'justify' 
  },
  card: { 
    backgroundColor: '#FBFBFB', 
    padding: 10, 
    borderRadius: 2, 
    marginBottom: 6, 
    borderBottom: 1,
    borderColor: '#EEEEEE'
  },
  footer: { 
    position: 'absolute', 
    bottom: 30, 
    left: 50, 
    right: 50, 
    borderTop: 1, 
    borderColor: '#EEEEEE', 
    paddingTop: 10, 
    fontSize: 8, 
    color: '#999999', 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  }
});

export const EcomindsReport = ({ result, formData }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Image 
            src="/ecominds logo sem fundo.png"
            style={styles.logo} 
          />
          <Text style={styles.brandName}>ECOMINDSX</Text>
          <Text style={{ fontSize: 8, color: '#2D5A46', marginTop: 2 }}>STUDIO DE INTELIGÊNCIA AMBIENTAL</Text>
        </View>
        <Text style={styles.reportType}>Diagnóstico Executivo</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Análise de Viabilidade e Conforto</Text>
        <Text style={styles.content}>{result.summary}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Plano de Materiais e ROI</Text>
        {result.thermal?.recommendedMaterials?.map((item: string, i: number) => (
          <View key={i} style={styles.card}>
            <Text style={{ fontSize: 9, color: '#333333' }}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text>Relatório gerado para: {formData?.location || 'Alvorada/RS'}</Text>
        <Text>www.ecomindsx.com.br</Text>
      </View>
    </Page>
  </Document>
);
