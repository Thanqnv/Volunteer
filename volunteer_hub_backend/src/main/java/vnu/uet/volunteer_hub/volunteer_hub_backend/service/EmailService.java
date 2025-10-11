package vnu.uet.volunteer_hub.volunteer_hub_backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    public void sendRecoveryCode(String to, String code) {
        try {
            logger.info("Đang chuẩn bị gửi email khôi phục mật khẩu đến: {}", to);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Mã khôi phục mật khẩu");
            message.setText("Mã khôi phục của bạn là: " + code);

            logger.debug("Nội dung email: {}", message.getText());

            mailSender.send(message);

            logger.info("✅ Đã gửi thành công email khôi phục mật khẩu đến: {}", to);

        } catch (MailException e) {
            logger.error("❌ Lỗi khi gửi email đến {}: {}", to, e.getMessage(), e);
            throw e; // Re-throw để controller có thể xử lý
        } catch (Exception e) {
            logger.error("❌ Lỗi không mong muốn khi gửi email đến {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Không thể gửi email: " + e.getMessage(), e);
        }
    }
}