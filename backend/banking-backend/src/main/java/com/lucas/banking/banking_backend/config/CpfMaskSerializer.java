package com.lucas.banking.banking_backend.config;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

public class CpfMaskSerializer extends JsonSerializer<String> {

    @Override
    public void serialize(String cpf, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        if (cpf == null) {
            jsonGenerator.writeString("");
            return;
        }
        // Remove tudo que não for número (pontos, traços, etc)
        String onlyNumbers = cpf.replaceAll("\\D", "");

        if (onlyNumbers.length() == 11) {
            String masked = onlyNumbers.substring(0, 3) + ".***.***-" + onlyNumbers.substring(9);
            jsonGenerator.writeString(masked);
        } else {
            jsonGenerator.writeString(cpf);
        }
    }
}
