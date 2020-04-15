/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import { Modal, Input, Form, Button, notification } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'i18n';
import { mq } from 'common/constants';
import {
  requestPasswordReset,
  requestPasswordResetVariables,
} from 'graphql/mutations/__generated__/requestPasswordReset';
import requestPasswordResetMutation from 'graphql/mutations/requestPasswordReset.graphql';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

const RequestPasswordResetModal: React.FC<IProps> = ({ visible, onClose }) => {
  const { t } = useTranslation(['auth', 'common']);
  const [form] = Form.useForm();

  const [requestPasswordReset, { loading }] = useMutation<
    requestPasswordReset,
    requestPasswordResetVariables
  >(requestPasswordResetMutation);
  const handleOk = React.useCallback(async () => {
    const values = await form.validateFields();

    const { data } = await requestPasswordReset({
      variables: {
        email: values.email,
      },
    });
    if (data?.requestPasswordReset?.ok) {
      onClose();
      notification.success({
        message: t('REQUEST_PASSWORD_RESET_EMAIL_SENT.TITLE'),
        description: t('REQUEST_PASSWORD_RESET_EMAIL_SENT.DESCRIPTION'),
      });
    }

    form.resetFields();
  }, [requestPasswordReset, onClose, form]);

  return (
    <Modal
      title={
        <div css={{ fontSize: '0.9rem' }}>{t('REQUEST_PASSWORD_RESET')}</div>
      }
      visible={visible}
      onCancel={onClose}
      bodyStyle={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      footer={[
        <Button
          key="cancel"
          type="default"
          onClick={onClose}
          css={{ fontSize: '0.75rem' }}
        >
          {t('CANCEL', { ns: 'common' })}
        </Button>,
        <Button
          form="request-password-reset-form"
          key="submit"
          htmlType="submit"
          type="primary"
          loading={loading}
          css={{ fontSize: '0.75rem' }}
        >
          {t('OK', { ns: 'common' })}
        </Button>,
      ]}
    >
      <Form
        form={form}
        name="request_password_reset"
        id="request-password-reset-form"
        initialValues={{ remember: true }}
        onFinish={handleOk}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        css={{ [mq[1]]: { width: '70%' } }}
      >
        <Form.Item
          name="email"
          label={<span css={{ fontSize: '0.75rem' }}>{t('EMAIL')}</span>}
          rules={[
            { required: true, message: t('VALIDATION.EMAIL_REQUIRED') },
            {
              pattern: /[^@]+@[^@]+\.[^@]+/,
              message: t('VALIDATION.VALID_EMAIL'),
            },
          ]}
          validateTrigger={'onSubmit'}
        >
          <Input placeholder={t('EMAIL')} css={{ fontSize: '0.75rem' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RequestPasswordResetModal;