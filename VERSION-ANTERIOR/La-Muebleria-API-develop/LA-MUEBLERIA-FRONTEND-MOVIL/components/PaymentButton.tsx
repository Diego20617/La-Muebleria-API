import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface PaymentButtonProps {
  apiKey: string;
  amount: string;
  tax: string;
  taxIco: string;
  taxBase: string;
  name: string;
  description: string;
  currency: string;
  country: string;
  test: string;
  external: string;
  responseUrl: string;
  confirmationUrl: string;
  buttonImageUrl: string;
}

export default function PaymentButton({
  apiKey,
  amount,
  tax,
  taxIco,
  taxBase,
  name,
  description,
  currency,
  country,
  test,
  external,
  responseUrl,
  confirmationUrl,
  buttonImageUrl,
}: PaymentButtonProps) {
  const html = `
    <html>
      <head></head>
      <body>
        <form>
          <script src="https://checkout.epayco.co/checkout.js"
            data-epayco-key="${apiKey}"
            class="epayco-button"
            data-epayco-amount="${amount}"
            data-epayco-tax="${tax}"
            data-epayco-tax-ico="${taxIco}"
            data-epayco-tax-base="${taxBase}"
            data-epayco-name="${name}"
            data-epayco-description="${description}"
            data-epayco-currency="${currency}"
            data-epayco-country="${country}"
            data-epayco-test="${test}"
            data-epayco-external="${external}"
            data-epayco-response="${responseUrl}"
            data-epayco-confirmation="${confirmationUrl}"
            data-epayco-button="${buttonImageUrl}">
          </script>
        </form>
      </body>
    </html>
  `;
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        automaticallyAdjustContentInsets
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: '100%',
    marginTop: 16,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});