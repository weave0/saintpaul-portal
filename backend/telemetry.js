// OpenTelemetry initialization (optional). Only activates if OTEL_EXPORTER or OTEL_ENABLED is set.
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');

let sdk;

function initTelemetry(logger) {
  if (process.env.OTEL_ENABLED !== 'true') {
    return null;
  }
  sdk = new NodeSDK({
    instrumentations: [getNodeAutoInstrumentations()],
  });
  // If no OTLP exporter configured, attach simple console exporter for dev
  if (!process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
    sdk.configureTracerProvider((provider) => {
      provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
    });
  }
  sdk.start()
    .then(() => logger && logger.info('OpenTelemetry SDK started'))
    .catch(err => logger && logger.error({ err }, 'OpenTelemetry start failed'));
  process.on('SIGTERM', () => {
    sdk.shutdown().finally(() => process.exit(0));
  });
  return sdk;
}

module.exports = { initTelemetry };